import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { BOARD_EMPTY_VALUE, gameStatusObject, kulamiMenuObject, RED} from "../../../config/kulami.config";
import { selectKulami } from "../KulamiSlice";
import { extractTileSize, isEnoughSpace, isOutOfTile, isTileFit, isTileNextToAnother } from "../../../utils/kulami.utils";
// import { isMoveValid } from "../../../utils/kulami.utils";

export interface BoardSquareProps {
  x: number;
  y: number;
}

const BoardSquare = ({ x, y }: BoardSquareProps) => {
  const [isTileOnSquare, setIsTileOnSquare] = useState<boolean>(false);
  const [isPawnOnSquare, setIsPawnOnSquare] = useState<boolean>(false);
  const [color, setColor] = useState("");
  // const [selectedSquare, setSelectedSquare] = useState({x: -1, y: -1});

  
  
  const kulami = useAppSelector(selectKulami);
  const dispatch = useAppDispatch();
  const boardSquareRef = useRef<HTMLDivElement>(null);


  var highlighted = '';
  if (kulami.positionStack.length >= 1) {
    if ((kulami.positionStack[0].posX === x || kulami.positionStack[0].posY === y) && (kulami.boardTileArray[x][y] !== BOARD_EMPTY_VALUE)) {
      highlighted = "kulami-highlight";
    }
  }

  function handleClick(): void {
    if(kulami.menu === kulamiMenuObject.MENU_MAPPING){
        dispatch(
            placeTile({
              posX: x,
              posY: y,
            })
        )
    } else {
        if (boardSquareRef.current) {
          dispatch(
            placePawn({
              posX: x,
              posY: y,
            })
          )
          // if (isMoveValid(kulami.boardTileArray, kulami.boardPawnArray, x, y, kulami.nbRedPawn, kulami.nbBlackPawn, kulami.positionStack)) {
          //   if (selectedSquare.x === x && selectedSquare.y === y) return;
          //   setColor((kulami.player === RED) ? "bg-red-500" : "bg-black-500");
          //   setSelectedSquare({x: x, y: y});
          // }
        }
    }
  }

  function handleOver(): void {
    if(kulami.menu === kulamiMenuObject.MENU_MAPPING){
      if (boardSquareRef.current && kulami.selectedTile) {
        const [width, height] = extractTileSize(kulami.selectedTile);
        if ( 
          (kulami.tileStack.length === 0) ||
          (
            isTileFit(x, y, width, height) && 
            isEnoughSpace(kulami.boardTileArray, x, y, width, height) &&
            isTileNextToAnother(x, y, width, height, kulami.boardTileArray) &&
            !isOutOfTile(kulami.selectedTile, kulami.nbTile2Toltal, kulami.nbTile3Toltal, kulami.nbTile4Toltal, kulami.nbTile6Toltal)
          ) 
        ) {
          boardSquareRef.current.classList.add("bg-green-500");
        } else {
          boardSquareRef.current.classList.add("bg-rose-600");
        }
      }
    }
  }

  function handleOut(): void {
    if(kulami.menu === kulamiMenuObject.MENU_MAPPING){
      if (boardSquareRef && boardSquareRef.current) {
        boardSquareRef.current.classList.remove("bg-green-500");
        boardSquareRef.current.classList.remove("bg-rose-600");
      }
    }
  }


  useEffect(() => {
    const tileIndex = kulami.boardTileArray[x][y];
    const squareColor = tileColorArray[tileIndex];

    if (boardSquareRef.current) {
      boardSquareRef.current.style.background = squareColor;
      if (tileIndex !== BOARD_EMPTY_VALUE) {
        boardSquareRef.current.style.borderColor = "transparent";
        setIsTileOnSquare(true);
      }
    }
  }, [kulami.boardTileArray, x, y]);

  useEffect(() => {
    const pos = kulami.boardPawnArray[x][y];
    if (boardSquareRef.current) {
      if (pos !== BOARD_EMPTY_VALUE) {
        boardSquareRef.current.style.backgroundColor= (kulami.player === RED) ? "red" : "blue";
        setIsPawnOnSquare(true);
      }
    }
  }, [kulami.boardPawnArray, x, y]);

  return (
    <div
    className={`h-20 w-20 border-black border-1 flex justify-center items-center ${highlighted} ${color}`}
      ref={boardSquareRef}
      id={`(${x}, ${y})`}
      onClick={handleClick}
      onMouseOver={handleOver}
      onMouseOut={handleOut}
    >
      {isTileOnSquare && <CircleIcon></CircleIcon>}
      {IS_DEV && `(${x}, ${y})`}
      {(kulami.status === gameStatusObject.END_GAME) && kulami.boardTileArray[x][y]}
    </div>
  );
};

export default BoardSquare;
