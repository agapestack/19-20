import {
  BOARD_EMPTY_VALUE,
  kulamiConfig,
  TileType,
  RED,
  BLACK,
  PositionDataInterface,
  tileTypes,
  TileDataInterface,
  tileWinDetail,
} from "../config/kulami.config";

// Get [width,height] from selectedTile (kulami state)
export const extractTileSize = (tile: TileType): [number, number] => {
  return [Number(tile[0]), Number(tile[2])];
};

// verify that tile is next to another on board
export const isTileNextToAnother = (
  posX: number,
  posY: number,
  width: number,
  height: number,
  board: number[][]
) => {
  // top
  if (posY - 1 >= 0) {
    for (let i = 0; i < width; i++) {
      if (board[posX + i][posY - 1] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  // bottom
  // if (posY + 1 + width < kulamiConfig.nbColumn) {
  if (posY + height < kulamiConfig.nbColumn) {
    for (let i = 0; i < width; i++) {
      if (board[posX + i][posY + height] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }
  // right
  if (posX + width < kulamiConfig.nbRow) {
    for (let i = 0; i < height; i++) {
      if (board[posX + width][posY + i] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  // left
  if (posX - 1 >= 0) {
    for (let i = 0; i < height; i++) {
      if (board[posX - 1][posY + i] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  return false;
};

export const isTileFit = (
  x: number,
  y: number,
  width: number,
  height: number
): boolean => {
  return x + width > kulamiConfig.nbRow || y + height > kulamiConfig.nbColumn
    ? false
    : true;
};

export const isEnoughSpace = (
  boardTileArray: number[][],
  x: number,
  y: number,
  width: number,
  height: number
): boolean => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (boardTileArray[x + i][y + j] !== BOARD_EMPTY_VALUE) {
        return false;
      }
    }
  }
  return true;
};

export const isOutOfTile = (
  selectedTile: TileType,
  nbTile2: number,
  nbTile3: number,
  nbTile4: number,
  nbTile6: number
): boolean => {
  switch (selectedTile) {
    case tileTypes.tile_1x2:
    case tileTypes.tile_2x1:
      if (!nbTile2) return true;
      break;
    case tileTypes.tile_3x1:
    case tileTypes.tile_1x3:
      if (!nbTile3) return true;
      break;
    case tileTypes.tile_2x2:
      if (!nbTile4) return true;
      break;
    case tileTypes.tile_2x3:
    case tileTypes.tile_3x2:
      if (!nbTile6) return true;
      break;
    default:
  }
  return false;
};

export const isLastTile = (nbTile: number): boolean => {
  return nbTile === kulamiConfig.nbTotalTiles;
};

export const isFirstMove = (nbRed: number, nbBlack: number): boolean => {
  return nbRed < kulamiConfig.nbTotalRedPawn ||
    nbBlack < kulamiConfig.nbTotalBlackPawn
    ? false
    : true;
};

export const isMoveValid = (
  boardTileArray: number[][],
  boardPawnArray: number[][],
  posX: number,
  posY: number,
  nbRed: number,
  nbBlack: number,
  positionStack: PositionDataInterface[]
): boolean => {
  // verify that can't play outside of the field
  if (boardTileArray[posX][posY] === BOARD_EMPTY_VALUE) {
    return false;
  }
  // verify that the square is available
  if (boardPawnArray[posX][posY] !== BOARD_EMPTY_VALUE) {
    return false;
  }
  if (!isFirstMove(nbRed, nbBlack)) {
    // verify that can't play in the same tile and the tile before
    if (
      boardTileArray[posX][posY] ===
      boardTileArray[positionStack[0].posX][positionStack[0].posY]
    ) {
      return false;
    }

    if (positionStack.length > 1) {
      if (
        boardTileArray[posX][posY] ===
        boardTileArray[positionStack[1].posX][positionStack[1].posY]
      ) {
        return false;
      }
    }

    // verify that can only play relative to the last position played
    if (posX !== positionStack[0].posX && posY !== positionStack[0].posY) {
      return false;
    }
  }
  return true;
};

export const winTile = (
  boardTile: number[][],
  boardPawn: number[][],
  tileInd: number
): number => {
  var cptRed = 0;
  var cptBlack = 0;

  for (let i = 0; i < kulamiConfig.nbRow; i++) {
    for (let j = 0; j < kulamiConfig.nbColumn; j++) {
      if (boardTile[i][j] === tileInd) {
        if (boardPawn[i][j] === RED) {
          cptRed++;
        } else if (boardPawn[i][j] === BLACK) {
          cptBlack++;
        }
      }
    }
  }

  if (cptRed < cptBlack) return BLACK;
  if (cptRed > cptBlack) return RED;

  return -1;
};

export const isPawnNextToEachOther = (
  posX: number,
  posY: number,
  board: number[][],
  player: number
): boolean => {
  // top
  if (posY - 1 >= 0) {
    if (board[posX][posY - 1] === player) {
      return true;
    }
  }

  // bottom
  if (posY + 1 < kulamiConfig.nbColumn) {
    if (board[posX][posY - 1] === player) {
      return true;
    }
  }
  // right
  if (posX + 1 < kulamiConfig.nbRow) {
    if (board[posX + 1][posY] === player) {
      return true;
    }
  }

  // left
  if (posX - 1 >= 0) {
    if (board[posX - 1][posY] === player) {
      return true;
    }
  }
  return false;
};

export const getNbPawnAdjacent = (
  board: number[][],
  player: number
): number => {
  let res = 0;
  for (let i = 0; i < kulamiConfig.nbRow; i++) {
    for (let j = 0; j < kulamiConfig.nbColumn; j++) {
      if (isPawnNextToEachOther(i, j, board, player)) {
        res++;
      }
    }
  }
  return res;
};

export const computeTileWinDetail = (
  boardTileArray: number[][],
  boardPawnArray: number[][],
  tileStack: TileDataInterface[]
) => {
  let tileWinArray: tileWinDetail[] = [];

  for (let i = 0; i < tileStack.length; i++) {
    let winner = winTile(boardTileArray, boardPawnArray, i);
    if (!winner) {
      continue;
    }
    let point = 0;
    switch (tileStack[i].tileType) {
      case tileTypes.tile_1x2:
      case tileTypes.tile_2x1:
        point = 2;
        break;
      case tileTypes.tile_3x1:
      case tileTypes.tile_1x3:
        point = 3;
        break;
      case tileTypes.tile_2x2:
        point = 4;
        break;
      case tileTypes.tile_2x3:
      case tileTypes.tile_3x2:
        point = 6;
        break;
      default:
    }

    if (winner === RED) {
      tileWinArray.push({
        nbPoint: point,
        player: RED,
        tileID: i,
      });
    } else if (winner === BLACK) {
      tileWinArray.push({
        nbPoint: point,
        player: BLACK,
        tileID: i,
      });
    }
  }

  return tileWinArray;
};

export const computeScore = (
  tileWinDetails: tileWinDetail[],
  boardPawnArray: number[][]
): [number, number] => {
  // console.log("nbRedAdj: " + nbRedPawnAdj, "nbBlackAdj: " + nbBlackPawnAdj);

  let p1Score = 0;
  let p2Score = 0;

  for (let i = 0; i < tileWinDetails.length; i++) {
    let currentTile = tileWinDetails[i];
    if (currentTile.player === RED) {
      p1Score += currentTile.nbPoint;
    } else {
      p2Score += currentTile.nbPoint;
    }
  }

  let winner = computeBonusWinner(boardPawnArray);
  if (winner === RED) {
    p1Score += kulamiConfig.nbPointBonus;
  } else if (winner === BLACK) {
    p2Score += kulamiConfig.nbPointBonus;
  }

  return [p1Score, p2Score];
};

// return -1 if no bonus winner
export const computeBonusWinner = (boardPawnArray: number[][]): number => {
  let nbRedPawnAdj = getNbPawnAdjacent(boardPawnArray, RED);
  let nbBlackPawnAdj = getNbPawnAdjacent(boardPawnArray, BLACK);

  if (nbRedPawnAdj > nbBlackPawnAdj) {
    return RED;
  } else if (nbRedPawnAdj < nbBlackPawnAdj) {
    return BLACK;
  }

  return -1;
};

// export const getWinner = (redScore: number, blackScore: number): GAME_STATUS => {
//   let status;
//   if (redScore > blackScore) {
//     status = gameStatusObject.RED_WINS;
//     toast.success("Red Wins");
//   }
//   if (redScore < blackScore) {
//     status = gameStatusObject.BLACK_WINS;
//     toast.success("Black Wins");
//   }
//   toast.success("Tie");
//   return status;
// }

export const isEndGame = (
  boardTileArray: number[][],
  boardPawnArray: number[][],
  nbRed: number,
  nbBlack: number,
  positionStack: PositionDataInterface[]
) => {
  if (!nbRed) {
    return true;
  }
  for (let i = 0; i < kulamiConfig.nbRow; i++) {
    for (let j = 0; j < kulamiConfig.nbColumn; j++) {
      if (
        isMoveValid(
          boardTileArray,
          boardPawnArray,
          i,
          j,
          nbRed,
          nbBlack,
          positionStack
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
