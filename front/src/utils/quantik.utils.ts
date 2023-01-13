import {
  IQuantikBoard,
  IRegion,
  IQuantikCell,
  IPlayerConfig,
  quantikConfig,
  SideType,
  sideTypes,
  IQuantikPiece,
  shapeTypes,
  IPlayerPieces,
  EMPTY_PIECE,
} from "../config/quantik.config";

export const initPlayer = (name: string, isHost: boolean, side: SideType) => {
  const player: IPlayerConfig = {
    name: name,
    host: isHost,
    side: side,
  };
  return player;
};

export const initPlayerList = () => {
  const res: IPlayerConfig[] = [];

  const startingSide = randomSide();
  const otherSide =
    startingSide === sideTypes.white ? sideTypes.black : sideTypes.white;

  const playerOne: IPlayerConfig = {
    name: "",
    host: true,
    side: startingSide,
  };

  const playerTwo: IPlayerConfig = {
    name: "",
    host: true,
    side: otherSide,
  };

  res.push(playerOne);
  res.push(playerTwo);

  return res;
};

export const randomSide = () => {
  return getRandomInt(2) ? sideTypes.white : sideTypes.black;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const initPlayerPieces = (side: SideType) => {
  const res = [];
  for (
    let shapeIndex = 0;
    shapeIndex < quantikConfig.nbDifferentPieces;
    shapeIndex++
  ) {
    for (
      let pieceNumber = 0;
      pieceNumber < quantikConfig.nbShapePieces;
      pieceNumber++
    ) {
      res.push({
        pos: { x: -1, y: -1 },
        side: side,
        shape: intToShape(shapeIndex),
      } as IQuantikPiece);
    }
  }
  return { pieces: res };
};

export const intToShape = (n: number) => {
  switch (n) {
    case 0:
      return shapeTypes.sphere;
    case 1:
      return shapeTypes.cube;
    case 2:
      return shapeTypes.cone;
    case 3:
      return shapeTypes.cylinder;
  }
};

export const initQuantikBoard = (nbRow: number, nbColumn: number) => {
  const regionCellsCount = quantikConfig.regionSize;
  const gameBoard: IQuantikBoard = {
    regions: [],
  };

  for (let y = 0; y < quantikConfig.regionCount; y++) {
    const region: IRegion = {
      color: y % 3 ? sideTypes.black : sideTypes.white,
      cells: [],
    };

    for (let x = 0; x < regionCellsCount; x++) {
      const cell: IQuantikCell = {
        pos: {
          x: x,
          y: y,
        },
        piece: EMPTY_PIECE,
        region: y,
      };

      region.cells.push(cell);
    }

    gameBoard.regions.push(region);
  }

  return gameBoard;
};

export const posValid = (pos: { x: number; y: number }) => {
  var isXValid = false,
    isYValid = false;

  if (pos.x > 0 || pos.x < quantikConfig.nbRow) isXValid = true;
  if (pos.y > 0 || pos.y < quantikConfig.nbRow) isYValid = true;
  return isXValid && isYValid;
};

export const findRegion = (x: number, y: number) => {
  const boardWidth = quantikConfig.nbRow;

  const calcRegionX = x <= quantikConfig.nbRow / 2 - 1 ? 0 : 1;
  const calcRegionYOffset =
    y <= quantikConfig.nbRow / 2 - 1 ? 0 : boardWidth / 2;

  const res = (calcRegionX + calcRegionYOffset) as number;
  if (res >= boardWidth)
    throw new Error("Incoherent calculated region! Your code sucks!");

  return res;
};

export const linearize = (board: IQuantikBoard) => {
  var res: IQuantikCell[][] = [];
  for (let r = 0; r < quantikConfig.regionCount; r++) {
    var line: IQuantikCell[] = [];
    for (let c = 0; c < quantikConfig.regionSize; c++) {
      const regionOffset = c >= quantikConfig.regionSize / 2 ? 1 : 0;
      const regionIndex = regionOffset + (r % (quantikConfig.regionCount / 2));
      const regionCaseIndex = c % (quantikConfig.regionSize / 2);

      //console.log(`Region: ${regionIndex}, cell: ${regionCaseIndex}`);
      //console.log(`Cell (${c}, ${r}) <=> (${board.regions[regionIndex].cells[regionCaseIndex].pos.x}, ${board.regions[regionIndex].cells[regionCaseIndex].pos.y})`);

      const cell: IQuantikCell = {
        pos: {
          x: c,
          y: r,
        },
        piece: board.regions[regionIndex].cells[regionCaseIndex].piece,
        region: findRegion(c, r),
      };

      line.push(cell);
    }

    res.push(line);
  }

  return res;
};

export const isCellAvailable = (
  board: IQuantikCell[][],
  pos: { x: number; y: number }
) => {
  if (
    pos.x < 0 ||
    pos.x >= quantikConfig.nbColumn ||
    pos.y < 0 ||
    pos.y >= quantikConfig.nbRow
  )
    throw new Error("Invalid position.");

  var res: boolean = true;
  if (board[pos.y][pos.x].piece.shape !== "NONE") res = false;

  return res;
};

export const isPieceValidInLine = (
  board: IQuantikCell[][],
  direction: boolean,
  lineIndex: number,
  piece: IQuantikPiece
) => {
  if (lineIndex < 0 || lineIndex >= quantikConfig.nbRow)
    throw new Error("Incorrect line index.");

  var res: boolean = true;
  var currentPiece;

  for (let i = 0; i < quantikConfig.nbRow; i++) {
    currentPiece = direction ? board[i][lineIndex] : board[lineIndex][i];
    //console.log(`Checking piece: (${currentPiece.pos.x} (${i}), ${currentPiece.pos.y} (${lineIndex})) -> ${currentPiece.piece === piece}`);
    if (
      currentPiece.piece.shape === piece.shape &&
      currentPiece.piece.side !== piece.side
    )
      res = false;
  }

  return res;
};

export const isPieceValidInRegion = (
  board: IQuantikCell[][],
  piece: IQuantikPiece,
  pos: { x: number; y: number }
) => {
  const region = findRegion(pos.x, pos.y);
  if (region < 0 || region >= 4) throw new Error("Incorrect region index.");

  var res: boolean = true;
  var sameRegionCells: IQuantikCell[] = [];

  for (let y = 0; y < quantikConfig.nbRow; y++) {
    board[y].forEach((cell) => {
      if (cell.region === region) sameRegionCells.push(cell);
    });
  }

  //console.log(sameRegionCells);
  if (sameRegionCells === undefined) throw new Error("WTF!!");
  sameRegionCells.forEach((cell) => {
    if (cell.piece.shape === piece.shape && cell.piece.side !== piece.side)
      res = false;
  });

  return res;
};

export const isMoveValid = (
  board: IQuantikCell[][],
  piece: IQuantikPiece,
  pos: { x: number; y: number }
) => {
  var conditions: boolean[] = [];
  conditions.push(isPieceValidInLine(board, false, pos.y, piece));
  conditions.push(isPieceValidInLine(board, true, pos.x, piece));
  conditions.push(isPieceValidInRegion(board, piece, { x: pos.x, y: pos.y }));
  conditions.push(isCellAvailable(board, { x: pos.x, y: pos.y }));

  var res: boolean = true;
  conditions.forEach((condition) => {
    res = res && condition;
  });

  return res;
};

export const isWinningMove = (
  board: IQuantikCell[][],
  piece: IQuantikPiece,
  pos: { x: number; y: number }
) => {
  const region = findRegion(pos.x, pos.y);

  var sameRegionCells: IQuantikCell[] = [];
  var currentColumnPiece, currentLinePiece;
  var shapeTable: { [x: string]: number }[] = [];
  var res: {res: boolean, winningCells: {x: number, y: number}[]} = {res: false, winningCells: []};

  for (let i = 0; i < 3; i++) {
    shapeTable.push({
      SPHERE: 0,
      CUBE: 0,
      CONE: 0,
      CYLINDER: 0,
    });
  }

  for (let i = 0; i < 4; i++) {
    currentColumnPiece = board[i][pos.x];
    currentLinePiece = board[pos.y][i];

    if (currentLinePiece.piece.shape !== "NONE")
      shapeTable[0][currentLinePiece.piece.shape] += 1;
    if (currentColumnPiece.piece.shape !== "NONE")
      shapeTable[1][currentColumnPiece.piece.shape] += 1;
  }

  for (let y = 0; y < 4; y++) {
    board[y].forEach((cell) => {
      if (cell.region === region) sameRegionCells.push(cell);
    });
  }

  sameRegionCells.forEach((cell) => {
    if (cell.piece.shape !== "NONE") shapeTable[2][cell.piece.shape] += 1;
  });

  let winType = -1;
  shapeTable.forEach((shapeList, i) => {
    if (
      shapeList["SPHERE"] &&
      shapeList["CUBE"] &&
      shapeList["CYLINDER"] &&
      shapeList["CONE"]
    ) {
      res.res = true;
      winType = i;
    }
  });

  for (let i = 0; i < 4; i++) {
    switch (winType) {
      case 0:
        res.winningCells.push({x: i, y: pos.y});
        break;
      case 1:
        res.winningCells.push({x: pos.x, y: i});
        break;
      case 2:
        res.winningCells.push({x: sameRegionCells[i].pos.x, y: sameRegionCells[i].pos.y});
        break;
    }
  }

  return res;
};

export const playerHasAvailableMove = (
  board: IQuantikCell[][],
  pieceSet: IPlayerPieces
) => {
  const emptyCells: IQuantikCell[] = [];
  const availablePieces: IQuantikPiece[] = [];

  for (let y = 0; y < quantikConfig.nbRow; y++) {
    board[y].forEach((cell) => {
      if (cell.piece.shape === "NONE") emptyCells.push(cell);
    });
  }

  pieceSet.pieces.forEach((piece) => {
    if (piece.pos.x === -1 && piece.pos.y === -1) availablePieces.push(piece);
  });

  var moveAvailable = false;

  for (let ap = 0; ap < availablePieces.length; ap++) {
    for (let ec = 0; ec < emptyCells.length; ec++) {
      // Tests for each piece that the player can place (not yet on board) and each empty board cell
      // whether or not player has any move available to do.

      var moveValid = isMoveValid(board, availablePieces[ap], {
        x: emptyCells[ec].pos.x,
        y: emptyCells[ec].pos.y,
      });

      if (moveValid) {
        moveAvailable = true;
        break;
      }
    }
    if (moveAvailable) break;
  }

  return moveAvailable;
};
