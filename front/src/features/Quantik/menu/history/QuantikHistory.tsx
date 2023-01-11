import { useAppSelector } from "../../../../app/hooks";
import QuantikTurn from "./QuantikTurn";

const QuantikHistory = () => {
  const quantik = useAppSelector((state) => state.quantik);

  return (
    <div className="quantik-history">
      {quantik.history.map((turn) => (
        <QuantikTurn board={turn.board} move={turn.move}></QuantikTurn>
      ))}
    </div>
  );
};

export default QuantikHistory;
