import {
  Button,
  Card,
  CardContent, IconButton, Typography
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { decrementGameChoice, incrementGameChoice } from "../GlobalSlice";
import { GameDetail } from "../../../config/global.config";
import { WsContext } from "../../../context/WebsocketContext";
import { useNavigate } from "react-router-dom";

const GameMenu = () => {
  const global = useAppSelector((state) => state.global);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);

  useEffect(() => {
    if (global.roomID !== "") {
      navigate(`/game/${global.roomID}`);
    }
  }, [global.roomID]);

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden lobby-background">
      <Card sx={{ width: 400, height: 550 }}>
        <div className="w-full flex justify-center items-center mt-8 mb-8">
          <Typography variant="h4">Select your game</Typography>
        </div>
        <div className="flex justify-center items-center p-4">
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

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {GameDetail[global.gameChoice].gameName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {GameDetail[global.gameChoice].gameDescription}
          </Typography>
        </CardContent>

        <div className="flex justify-center items-center flex-col">
          <div className="m-2">
            <Button
              className="w-64"
              variant="contained"
              onClick={wsContext.createRoom}
            >
              Create a room
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameMenu;
