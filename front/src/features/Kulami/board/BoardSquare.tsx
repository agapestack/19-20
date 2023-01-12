import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { IS_DEV } from "../../../config/global.config";
import { BOARD_EMPTY_VALUE, kulamiMenuObject } from "../../../config/kulami.config";
import { tileColorArray } from "../../../utils/utils";
import { placePawn, placeTile, selectKulami } from "../KulamiSlice";

export interface BoardSquareProps {
  x: number;
  y: number;
}

const BoardSquare = ({ x, y }: BoardSquareProps) => {
  const [isTileOnSquare, setIsTileOnSquare] = useState<boolean>(false);
  const [isMarbleOnSquare, setIsMarbleOnSquare] = useState<boolean>(false);

  const kulami = useAppSelector(selectKulami);
  const dispatch = useAppDispatch();
  const boardSquareRef = useRef<HTMLDivElement>(null);

  function handleClick(): void{
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
        }
    }
}

  useEffect(() => {
    const tileIndex = kulami.boardTileArray[x][y];
    const squareColor = tileColorArray[tileIndex];

    if (boardSquareRef.current) {
      boardSquareRef.current.style.background = squareColor;
      if (tileIndex !== BOARD_EMPTY_VALUE) {
        // console.log(boardSquareRef.current.style);
        boardSquareRef.current.style.borderColor = "transparent";
        setIsTileOnSquare(true);
      }
    }
  }, [kulami.boardTileArray, x, y]);

  useEffect(() => {
    if (kulami.menu === kulamiMenuObject.MENU_MAPPING) return;
    const pos = kulami.boardPawnArray[x][y];
    if (boardSquareRef.current) {
      if (pos !== BOARD_EMPTY_VALUE) {
        boardSquareRef.current.style.borderColor = "black";
        boardSquareRef.current.style.borderWidth = "3px";
        setIsMarbleOnSquare(true);
      }
    }
  }, [kulami.positionStack, x, y]);

  return (
    <div
      className="h-20 w-20 border-black border-1 flex justify-center items-center"
      ref={boardSquareRef}
      id={`(${x}, ${y})`}
      onClick={handleClick}
    >
      {isTileOnSquare && <CircleIcon></CircleIcon>}
      {IS_DEV && `(${x}, ${y})`}
    </div>
  );
};

export default BoardSquare;
