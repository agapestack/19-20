import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  IQuantikCell,
  sideTypes,
  ShapeType,
} from "../../../config/quantik.config";
import { isMoveValid, posValid } from "../../../utils/quantik.utils";
import { placePiece } from "../QuantikSlice";

const QuantikCell = ({ cell, isHistoryCell }: { cell: IQuantikCell, isHistoryCell: boolean }) => {
  const quantik = useAppSelector((state) => state.quantik);
  const dispatch = useAppDispatch();
  const cellRef = useRef<HTMLDivElement>(null);

  const whiteColor = "bg-slate-200";
  const blackColor = "bg-slate-400";
  const validColor = "bg-green-500";
  const invalidColor = "bg-rose-600";

  if (!posValid(cell.pos)) throw new Error("Invalid cell position!");
  if (cell.region === null) throw new Error("Null region!");

  const isWinning = (quantik.winningCells.some((wCell) => { return (wCell.x === cell.pos.x && wCell.y === cell.pos.y) }));
  const regionColor = cell.region % 3 ? sideTypes.black : sideTypes.white;

  var backgroundColor = "bg-magenta";
  if (isWinning) {
    backgroundColor = "bg-[#00CC66]";
  } else {
    backgroundColor = (regionColor.toLowerCase() === "white") ? whiteColor : blackColor;
  }

  const drawShape = cell.piece.shape !== ("NONE" as ShapeType) ? true : false;
  const cellShapeUrl = `${process.env.PUBLIC_URL
    }/assets/quantik/shapes/${cell.piece.side.toLowerCase()}/${cell.piece.shape.toLowerCase()}.png`;

  return (
    <div
      className={`flex justify-center items-center rounded transition-all m-1 relative
        ${backgroundColor}
        ${isHistoryCell ? "w-8 h-8" : "w-14 h-14 lg:w-20 lg:h-20"}
      `}
      ref={cellRef}
      id={`(${cell.pos.x}, ${cell.pos.y})`}
      onClick={() => {
        if (quantik.selectedPiece !== -1) {
          dispatch(
            placePiece({
              piece: quantik.selectedPiece.piece,
              posX: cell.pos.x,
              posY: cell.pos.y,
            })
          );
        }
      }}
      onMouseOver={() => {
        if (quantik.selectedPiece !== -1 && cellRef && cellRef.current) {
          cellRef.current.classList.remove((regionColor === sideTypes.white) ? whiteColor : blackColor);
          if (
            isMoveValid(quantik.board, quantik.selectedPiece.piece, {
              x: cell.pos.x,
              y: cell.pos.y,
            })
          ) {
            cellRef.current.classList.add(validColor);
          } else {
            cellRef.current.classList.add(invalidColor);
          }
        }
      }}
      onMouseOut={() => {
        if (cellRef && cellRef.current) {
          cellRef.current.classList.add((regionColor === sideTypes.white) ? whiteColor : blackColor);
          cellRef.current.classList.remove(validColor);
          cellRef.current.classList.remove(invalidColor);
        }
      }}
    >
      {drawShape && (
        <img
          alt=""
          draggable="false"
          className={`quantik-cell-image`}
          src={cellShapeUrl}
        ></img>
      )}
    </div>
  );
};

export default QuantikCell;
