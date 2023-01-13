import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  BOARD_EMPTY_VALUE,
  kulamiMenuObject,
  MarbleAssets,
  RED,
} from "../../../config/kulami.config";
import { placePawn, placeTile, selectKulami } from "../KulamiSlice";
import {
  extractTileSize,
  isEnoughSpace,
  isMoveValid,
  isOutOfTile,
  isTileFit,
  isTileNextToAnother,
} from "../../../utils/kulami.utils";
import { tileColorArray } from "../../../utils/utils";
import { toast } from "react-toastify";
// import { isMoveValid } from "../../../utils/kulami.utils";

export interface BoardSquareProps {
  x: number;
  y: number;
}

const BoardSquare = ({ x, y }: BoardSquareProps) => {
  const kulami = useAppSelector(selectKulami);
  const dispatch = useAppDispatch();
  const boardSquareRef = useRef<HTMLDivElement>(null);
  const [isTileOnSquare, setIsTileOnSquare] = useState<boolean>(false);
  // const [selectedSquare, setSelectedSquare] = useState({x: -1, y: -1});

  // color piece square after placing
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
  }, [
    dispatch,
    kulami.boardPawnArray,
    kulami.boardTileArray,
    kulami.nbBlackPawn,
    kulami.nbRedPawn,
    kulami.positionStack,
    x,
    y,
  ]);

  var highlighted = "";
  if (kulami.positionStack.length >= 1) {
    if (
      (kulami.positionStack[0].posX === x ||
        kulami.positionStack[0].posY === y) &&
      isMoveValid(
        kulami.boardTileArray,
        kulami.boardPawnArray,
        x,
        y,
        kulami.nbRedPawn,
        kulami.nbBlackPawn,
        kulami.positionStack
      )
    ) {
      highlighted =
        kulami.player === RED
          ? "kulami-highlight-red"
          : "kulami-highlight-black";
    }
  }

  function handleClick(): void {
    if (kulami.menu === kulamiMenuObject.MENU_MAPPING) {
      dispatch(
        placeTile({
          posX: x,
          posY: y,
        })
      );
    } else {
      if (boardSquareRef.current) {
        if (
          !isMoveValid(
            kulami.boardTileArray,
            kulami.boardPawnArray,
            x,
            y,
            kulami.nbRedPawn,
            kulami.nbBlackPawn,
            kulami.positionStack
          )
        ) {
          toast.error("Invalid move!");
          return;
        }
        dispatch(
          placePawn({
            posX: x,
            posY: y,
          })
        );
      }
    }
  }

  // Highlight mapping: positionOK --> green, positionKO --> rose
  function handleOver(): void {
    if (kulami.menu === kulamiMenuObject.MENU_MAPPING) {
      if (boardSquareRef.current && kulami.selectedTile) {
        const [width, height] = extractTileSize(kulami.selectedTile);
        if (
          (kulami.tileStack.length === 0 && isTileFit(x, y, width, height)) ||
          (isTileFit(x, y, width, height) &&
            isEnoughSpace(kulami.boardTileArray, x, y, width, height) &&
            // isTileNextToAnother(x, y, width, height, kulami.boardTileArray) &&
            !isOutOfTile(
              kulami.selectedTile,
              kulami.nbTile2Toltal,
              kulami.nbTile3Toltal,
              kulami.nbTile4Toltal,
              kulami.nbTile6Toltal
            ))
        ) {
          boardSquareRef.current.classList.add("bg-green-500");
        } else {
          boardSquareRef.current.classList.add("bg-rose-600");
        }
      }
    }
  }

  function handleOut(): void {
    if (kulami.menu === kulamiMenuObject.MENU_MAPPING) {
      if (boardSquareRef && boardSquareRef.current) {
        boardSquareRef.current.classList.remove("bg-green-500");
        boardSquareRef.current.classList.remove("bg-rose-600");
      }
    }
  }

  function getMarbleAssetPath(x: number, y: number): string {
    let result = process.env.PUBLIC_URL || "";
    if (kulami.boardPawnArray[x][y] === RED) {
      result += MarbleAssets.redMarble;
    } else {
      result += MarbleAssets.blackMarble;
    }
    return result;
  }

  return (
    <div
      className={`h-20 w-20 border-black border-1 flex justify-center items-center ${highlighted}`}
      ref={boardSquareRef}
      id={`(${x}, ${y})`}
      onClick={handleClick}
      onMouseOver={handleOver}
      onMouseOut={handleOut}
    >
      {isTileOnSquare && kulami.boardPawnArray[x][y] === -1 && (
        <CircleIcon></CircleIcon>
      )}
      {kulami.boardPawnArray[x][y] !== -1 && (
        <img src={getMarbleAssetPath(x, y)} alt=""></img>
      )}
      {/* {IS_DEV && `(${x}, ${y})`}
      {kulami.status === gameStatusObject.END_GAME &&
        kulami.boardTileArray[x][y]} */}
    </div>
  );
};

export default BoardSquare;
