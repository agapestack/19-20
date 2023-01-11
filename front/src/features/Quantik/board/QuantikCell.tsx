import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  IQuantikCell,
  sideTypes,
  ShapeType,
} from "../../../config/quantik.config";
import { isMoveValid, posValid } from "../../../utils/quantik.utils";
import { placePiece } from "../QuantikSlice";

const QuantikCell = ({ cell }: { cell: IQuantikCell }) => {
  const quantik = useAppSelector((state) => state.quantik);
  const dispatch = useAppDispatch();
  const cellRef = useRef<HTMLDivElement>(null);

  if (!posValid(cell.pos)) throw new Error("Invalid cell position!");
  if (cell.region == null) throw new Error("Null region!");

  const regionColor = cell.region % 3 ? sideTypes.black : sideTypes.white;

  const drawShape = cell.piece.shape != ("NONE" as ShapeType) ? true : false;
  const cellShapeUrl = `${
    process.env.PUBLIC_URL
  }/assets/quantik/shapes/${cell.piece.side.toLowerCase()}/${cell.piece.shape.toLowerCase()}.png`;

  return (
    <div
      className={`flex justify-center items-center rounded transition-all m-1 w-14 h-14 lg:w-20 lg:h-20 relative ${
        regionColor.toLowerCase() == "white" ? "bg-white" : "bg-slate-800"
      }`}
      ref={cellRef}
      id={`(${cell.pos.x}, ${cell.pos.y})`}
      onClick={() => {
        if (quantik.selectedPiece != -1) {
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
        if (quantik.selectedPiece != -1 && cellRef && cellRef.current) {
          if (
            isMoveValid(quantik.board, quantik.selectedPiece.piece, {
              x: cell.pos.x,
              y: cell.pos.y,
            })
          ) {
            cellRef.current.classList.add("bg-green-500");
          } else {
            cellRef.current.classList.add("bg-rose-600");
          }
        }
      }}
      onMouseOut={() => {
        if (cellRef && cellRef.current) {
          cellRef.current.classList.remove("bg-green-500");
          cellRef.current.classList.remove("bg-rose-600");
        }
      }}
    >
      {drawShape && (
        <img
          draggable="false"
          className="quantik-cell-image"
          src={cellShapeUrl}
        ></img>
      )}
    </div>
  );
};

export default QuantikCell;
