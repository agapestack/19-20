import { kulamiConfig } from "../../../config/kulami.config";
import { generateRandomString } from "../../../utils/utils";
import BoardSquare from "./BoardSquare";

const Board = () => {
  return (
    <div className="flex flex-col justify-center items-center kulami-board-background rounded-lg drop-shadow-lg">
      {[...Array(kulamiConfig.nbRow)].map((r, y) => (
        <div className="flex h-20" key={y + generateRandomString(11)}>
          {[...Array(kulamiConfig.nbColumn)].map((c, x) => (
            <BoardSquare key={`(${x}, ${y})`} x={x} y={y}></BoardSquare>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
