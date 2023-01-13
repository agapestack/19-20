import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button, IconButton, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GameDetail, gameStateObject } from "../../../config/global.config";
import { WsContext } from "../../../context/WebsocketContext";
import {
  decrementGameChoice,
  incrementGameChoice,
  setGameChoice,
} from "../GlobalSlice";

const GameSelection = () => {
  const global = useAppSelector((state) => state.global);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);
  let { gameChoice } = useParams<string>();

  useEffect(() => {
    if (global.roomID !== "") {
      navigate(
        "/game/" + GameDetail[global.gameChoice].gameName + "/" + global.roomID
      );
    }
  }, [global, navigate]);

  useEffect(() => {
    setGameChoice(gameChoice === "KULAMI" ? 0 : 1);
  }, []);

  const handlePlayOffline = () => {
    let choice = GameDetail[global.gameChoice].gameName;
    switch (choice) {
      case gameStateObject.kulami:
        navigate("/offline/kulami");
        break;
      case gameStateObject.quantik:
        navigate("/offline/quantik");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden background-color">
      <div className="grid grid-rows-5 justify-center bg-white rounded-xl select-card">
        <div className="row-span-1 flex justify-center items-center mt-8 mb-8">
          <Typography variant="h4">Select your game</Typography>
        </div>
        <div className="row-span-1 flex justify-center items-center p-4">
          <IconButton onClick={() => dispatch(decrementGameChoice())}>
            <ArrowBackIosIcon></ArrowBackIosIcon>
          </IconButton>
          <img
            className="w-64"
            src={
              process.env.PUBLIC_URL + GameDetail[global.gameChoice].logoPath
            }
            alt="gameLogo"
          />
          <IconButton onClick={() => dispatch(incrementGameChoice())}>
            <ArrowForwardIosIcon></ArrowForwardIosIcon>
          </IconButton>
        </div>

        <div className="row-span-2 h-full flex flex-col justify-center items-center">
          <div className="text-xl my-2">
            <h3>Description</h3>
          </div>

          <div className="mx-12">
            {GameDetail[global.gameChoice].gameDescription}
          </div>
        </div>

        <div className="row-span-1 flex justify-around items-center mb-4">
          <div className="w-48">
            <Button
              fullWidth={true}
              variant="contained"
              onClick={wsContext.createRoom}
            >
              Create a room
            </Button>
          </div>

          <div className="w-48">
            <Button
              fullWidth={true}
              variant="contained"
              onClick={handlePlayOffline}
            >
              Play offline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
