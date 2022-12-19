import { gameTypeObject, GAME_NAME } from "../../config/global.config";
import Kulami from "../Kulami/Kulami";
import "react-toastify/dist/ReactToastify.css";

export interface GameProps {
  gameName: GAME_NAME;
}

const Game = ({ gameName }: GameProps) => {
  return (
    <div className="h-full w-full">
      {gameName === gameTypeObject.kulami && <Kulami></Kulami>}
    </div>
  );
};

export default Game;
