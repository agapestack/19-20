import React, { useEffect, useRef, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { placeTile, placePawn } from "../KulamiSlice";
import { IS_DEV } from "../../../config/global.config";
import { tileColorArray } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { BOARD_EMPTY_VALUE, kulamiMenuObject, RED} from "../../../config/kulami.config";
import { selectKulami } from "../KulamiSlice";

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

  var highlighted = '';
  if (kulami.positionStack.length >= 1) {
    if ((kulami.positionStack[0].posX === x || kulami.positionStack[0].posY === y) && (kulami.boardTileArray[x][y] !== BOARD_EMPTY_VALUE)) {
      highlighted = "kulami-highlight";
    }
  }

//   var imgSrc = '';
//   if (kulami.boardPawnArray[x][y] !== BOARD_EMPTY_VALUE) {
//     imgSrc = (kulami.player === RED) ? "bg-[url('process.env.PUBLIC_URL + '/kulami/kulami_marbleRed.png'')]" : "bg-[url('process.env.PUBLIC_URL + '/kulami/kulami_marbleBlack.png'')]";
//   }

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
        boardSquareRef.current.style.borderColor = "red";
        boardSquareRef.current.style.borderWidth = "5px";
        setIsMarbleOnSquare(true);
      }
    }
  }, [kulami.positionStack, x, y]);

  return (
    <div
    className={`h-20 w-20 border-black border-1 flex justify-center items-center ${highlighted}`}
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
