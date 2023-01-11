import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { decrementGameChoice, incrementGameChoice } from "../GlobalSlice";
import { GameDetail } from "../../../config/global.config";
import { WsContext } from "../../../context/WebsocketContext";
import { useNavigate } from "react-router-dom";

const GameSelection = () => {
  const global = useAppSelector((state) => state.global);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);

  useEffect(() => {
    navigate("/game/" + global.roomID)
  }, [global.roomID])

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

        <div className="row-span-1 flex flex-col justify-around items-center mb-4">
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
              onClick={wsContext.createRoom}
            >
              Join a room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;