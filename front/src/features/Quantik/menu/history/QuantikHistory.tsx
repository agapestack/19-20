import { useAppSelector } from "../../../../app/hooks";
import QuantikTurn from "./QuantikTurn";

const QuantikHistory = () => {
  const quantik = useAppSelector((state) => state.quantik);

  return (
      <div className="w-4/5 max-w-4/5 overflow-x-scroll bg-black/20 mb-4 pb-4 flex gap-x-2 p-2 box-border rounded-lg">
          {quantik.history.map((turn, i) => (
            <div className="pointer-events-none">
              <QuantikTurn board={turn.board} move={turn.move} index={i+1}></QuantikTurn>
            </div>
          ))}
      </div>
  );
};

export default QuantikHistory;
