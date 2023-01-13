import { useRef } from "react";
import { ISelectedPiece } from "../../../config/quantik.config";
import { useAppSelector } from "../../../app/hooks";

const SelectedPiece = (piece: ISelectedPiece) => {
  const quantik = useAppSelector((state) => state.quantik);
  const selectedShapeRef = useRef<HTMLDivElement>(null);

  const ShapeImgUrl = `${process.env.PUBLIC_URL}/assets/quantik/shapes/${piece.piece.side.toLowerCase()}/${piece.piece.shape.toLowerCase()}.png`;

  return(
    <div ref={selectedShapeRef} className="flex justify-center align-center min-h-[6rem] min-w-[6rem]">
      {quantik.selectedPiece !== -1 && <img alt="" draggable="false" src={ShapeImgUrl} className="w-24 h-24"></img>}
    </div>
  )

};

export default SelectedPiece;
