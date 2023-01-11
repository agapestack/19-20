import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectPiece } from "../QuantikSlice";
import "./SelectedPiece";
import { IQuantikPiece, shapeTypes } from "../../../config/quantik.config";

const QuantikShapeMenu = () => {
  const quantik = useAppSelector((state) => state.quantik);
  const dispatch = useAppDispatch();

  const listToSearch: IQuantikPiece[] =
    quantik.playerList[quantik.player].side === "WHITE"
      ? quantik.pieces.white.pieces
      : quantik.pieces.black.pieces;

  const findShape = (piece: IQuantikPiece) => {
    const pieces = listToSearch.find((lPiece) => {
      return lPiece.shape === piece.shape;
    });
    return pieces != undefined ? pieces.shape : shapeTypes.cone;
  };

  return (
    <div className="w-full lg:w-3/5 h-full my-4 lg:my-0 flex justify-evenly items-center">
      <div className="flex justify-evenly items-center w-full flex-wrap lg:flex-nowrap gap-x-2 gap-y-2">
        {listToSearch.map((piece) => (
          <button
            className="transition-all relative quantik-menu-shape w-24"
            onClick={() =>
              dispatch(
                selectPiece({
                  piece: {
                    shape: findShape(piece),
                    side: quantik.playerList[quantik.player].side,
                    pos: { x: -1, y: -1 },
                  },
                })
              )
            }
          >
            <img
              alt=""
              draggable="false"
              src={`${
                process.env.PUBLIC_URL
              }/assets/quantik/shapes/${quantik.playerList[
                quantik.player
              ].side.toLowerCase()}/${piece.shape.toLowerCase()}.png`}
            ></img>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuantikShapeMenu;
