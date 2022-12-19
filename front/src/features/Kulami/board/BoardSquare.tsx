import React, { useEffect, useRef, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { placeTile } from "../KulamiSlice";
import { IS_DEV } from "../../../config/global.config";
import { tileColorArray } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export interface BoardSquareProps {
  x: number;
  y: number;
}

const BoardSquare = ({ x, y }: BoardSquareProps) => {
  const [isTileOnSquare, setIsTileOnSquare] = useState<boolean>(false);
  const kulami = useAppSelector((state) => state.kulami);
  const dispatch = useAppDispatch();
  const boardSquareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tileIndex = kulami.boardTileArray[x][y];
    const squareColor = tileColorArray[tileIndex];

    if (boardSquareRef.current) {
      boardSquareRef.current.style.background = squareColor;
      if (tileIndex !== -1) {
        // console.log(boardSquareRef.current.style);
        boardSquareRef.current.style.borderColor = "transparent";
        setIsTileOnSquare(true);
      }
    }
  }, [kulami.boardTileArray, x, y]);

  return (
    <div
      className="h-20 w-20 border-black border-1 flex justify-center items-center"
      ref={boardSquareRef}
      id={`(${x}, ${y})`}
      onClick={() =>
        dispatch(
          placeTile({
            posX: x,
            posY: y,
          })
        )
      }
    >
      {isTileOnSquare && <CircleIcon></CircleIcon>}
      {IS_DEV && `(${x}, ${y})`}
    </div>
  );
};

export default BoardSquare;
