import { Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { WsContext } from "../../../context/WebsocketContext";
import Chat from "../Chat";
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
    <div className="grid grid-cols-12 grid-rows-4 w-screen h-screen overflow-hidden lobby-background">
      <div className="col-span-3 row-span-1"></div>
    
      <div className="col-span-6 row-span-2 w-full h-full bg-white rounded-lg p-8 m-8">
        <Button href="/">Home</Button>
        <div className="grid grid-cols-2">
          {/* parameter */}
          <div className="flex">
            <Chat></Chat>
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

      <div className="col-span-3 row-span-1"></div>
    </div>
  );
};

export default Lobby;
