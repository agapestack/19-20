import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button, IconButton, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PlayerAvatar } from "../../../config/global.config";
import { WsContext } from "../../../context/WebsocketContext";
import {
  decrementAvatarChoice,
  incrementAvatarChoice,
  setGameChoice,
  setRoomId,
  setUsername,
  toggleMeHasJoin,
} from "../GlobalSlice";

const Join = () => {
  const global = useAppSelector((state) => state.global);
  const [connID, setConnID] = useState<string>("");
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);
  const navigate = useNavigate();
  let { roomID, gameChoice } = useParams<string>();
  console.log(roomID);

  const isUsernameValid = () => {
    return global.me.username.length >= 4;
  };

  const handleJoinRoom = () => {
    dispatch(toggleMeHasJoin());
    console.log(global.gameChoice);
    wsContext.joinRoom(connID, global.me.username, global.me.avatarID);
  };

  useEffect(() => {
    console.log("useEffect");
    if (roomID) {
      setConnID(roomID);
      dispatch(setGameChoice(gameChoice === "KULAMI" ? 0 : 1));
      dispatch(setRoomId(roomID));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-rows-6 bg-green-100 w-full p-4 rounded-xl">
      <div className="row-span-1 text-4xl text-center mt-4">
        <h1>Play</h1>
      </div>

      <div className="row-span-2 flex justify-center items-center">
        <IconButton onClick={() => dispatch(decrementAvatarChoice())}>
          <ArrowBackIosIcon></ArrowBackIosIcon>
        </IconButton>
        <img src={PlayerAvatar[global.me.avatarID].imgPath} alt="" />
        <IconButton onClick={() => dispatch(incrementAvatarChoice())}>
          <ArrowForwardIosIcon></ArrowForwardIosIcon>
        </IconButton>
      </div>

      <div className="row-span-1 flex justify-center items-center">
        <TextField
          id="outlined-basic"
          label="Enter Username"
          variant="outlined"
          value={global.me.username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
        />
      </div>

      <div className="row-span-1 flex justify-center items-center">
        <Button
          variant="contained"
          color="success"
          disabled={!isUsernameValid()}
          onClick={handleJoinRoom}
        >
          Join game
        </Button>
      </div>
    </div>
  );
};

export default Join;
