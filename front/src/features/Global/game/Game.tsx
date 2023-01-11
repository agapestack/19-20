import {
  gameStateObject,
  GAME_STATE,
} from "../../../config/global.config";
import Kulami from "../../Kulami/Kulami";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { WsContext } from "../../../context/WebsocketContext";
import { useContext } from "react";
import GameSelection from "./GameSelection";
import GameLobby from "./GameLobby";

interface GameProps {
  gameState: GAME_STATE;
}

const Game = ({ gameState }: GameProps) => {
  const global = useAppSelector((state) => state.global);


  return (
    <div className="h-full w-full">
      {/* {gameState === gameStateObject.select && <GameSelection></GameSelection>}
      {gameState === gameStateObject.lobby && <Lobby></Lobby>} */}
    </div>
  );
};

export default Game;
