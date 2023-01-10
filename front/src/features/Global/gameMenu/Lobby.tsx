import { Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { WsContext } from "../../../context/WebsocketContext";
import { setRoomId } from "../GlobalSlice";

const Lobby = () => {
  const global = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wsContext = useContext(WsContext);
  let { roomID } = useParams<string>();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (roomID) {
      setRoomId(roomID);
      wsContext.joinRoom(roomID);
    } else {
      navigate("/")
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden lobby-background">
    
      <div className="bg-white rounded-lg p-8 m-8 flex flex-col w-96">
        <Button href="/">Home</Button>
        <div className="grid grid-cols-2">
          {/* parameter */}
          <div className="flex">
            <Typography>Parameters</Typography>
          </div>

          {/* players */}
          <div className="flex flex-col">
            <div className="">player1</div>

            <div className="">player2</div>
          </div>

        
        </div>

        <div className="flex justify-center items-center">
          <div className="">
            <Button variant="contained" color="success">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
