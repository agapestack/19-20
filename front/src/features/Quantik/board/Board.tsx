import { quantikConfig } from "../../../config/quantik.config";
import { useAppSelector } from "../../../app/hooks";
import QuantikCell from "./QuantikCell";

const Board = () => {
  const quantik = useAppSelector((state) => state.quantik);

  return (
    <div className="flex flex-col justify-center items-center bg-slate-600 p-1 rounded-lg">
      {[...Array(quantikConfig.nbRow)].map((r, y) => (
        <div className="flex">
          {[...Array(quantikConfig.nbColumn)].map((c, x) => (
            <QuantikCell
              key={`(${x}, ${y})`}
              isHistoryCell={false}
              cell={{
                pos: { x: x, y: y },
                piece: quantik.board[y][x].piece,
                region: quantik.board[y][x].region,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
