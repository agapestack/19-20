import {
  gameStateObject,
  GAME_STATE
} from "../../../config/global.config";
import Kulami from "../../Kulami/Kulami";
import Quantik from "../../Quantik/Quantik";

interface GameProps {
  gameState: GAME_STATE;
}

const Game = ({ gameState }: GameProps) => {
  return (
    <div className="h-full w-full">
      {gameState === gameStateObject.kulami && <Kulami></Kulami>}
      {gameState === gameStateObject.quantik && <Quantik></Quantik>}
    </div>
  );
};

export default Game;
