import { IQuantikTurn, quantikConfig } from "../../../../config/quantik.config";
import QuantikCell from "../../board/QuantikCell";

const QuantikTurn = (turn: IQuantikTurn) => {
  return (
    <div className="quantik-turn">
      {[...Array(quantikConfig.nbRow)].map((r, y) => (
        <div className="flex">
          {[...Array(quantikConfig.nbColumn)].map((c, x) => (
            <QuantikCell
              key={`(${x}, ${y})`}
              cell={{
                pos: { x: x, y: y },
                piece: turn.board[y][x].piece,
                region: turn.board[y][x].region,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuantikTurn;
