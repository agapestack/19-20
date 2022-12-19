import {
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  decrementGameChoice,
  incrementGameChoice,
  updateUsername,
} from "../GlobalSlice";
import { GameDetail } from "../../../config/global.config";
import { WsContext } from "../../../context/WebsocketContext";

const GameMenu = () => {
  const [isValidUsername, setIsValidUsername] = useState(false);
  const global = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);

  useEffect(() => {
    if (global.username.length >= 6) {
      setIsValidUsername(true);
    } else {
      setIsValidUsername(false);
    }
  }, [global.username]);

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

        {!wsContext.isConnected && (
          <div className="flex flex-col justify-center items-center">
            <TextField
              variant="outlined"
              label="username"
              onChange={(e) => dispatch(updateUsername(e.target.value))}
            ></TextField>
            <div className="my-4">
              <Button
                variant="contained"
                color="success"
                disabled={!isValidUsername}
                onClick={wsContext.CONN}
              >
                Connect
              </Button>
            </div>
          </div>
        )}

        {wsContext.isConnected && (
          <div className="">
            <div className="m-2">
              <Button className="w-64" variant="contained">
                Create a room
              </Button>
            </div>

            <div className="m-2">
              <Button className="w-64" variant="contained">
                Join a room
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GameMenu;
