import { Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { WsContext } from "../../../context/WebsocketContext";
import Chat from "../Chat";
import { setRoomId } from "../GlobalSlice";

const GameLobby = () => {
  const global = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wsContext = useContext(WsContext);
  let { roomID } = useParams<string>();

  useEffect(() => {
    if (roomID) {
      setRoomId(roomID);
      wsContext.joinRoom(roomID);
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-12 grid-rows-5 w-screen h-screen overflow-hidden background-color">
      <div className="col-span-12 row-span-1"></div>

      <div className="col-span-12 row-span-3 grid grid-cols-12">
        <div className="col-span-3"></div>

        <div className="col-span-6 bg-white rounded-lg p-4 m-2">
          
          <div className="grid grid-cols-2 h-full">
            {/* chat */}
            <div className="flex">
              <Chat></Chat>
            </div>

            {/* players */}
            <div className="flex flex-col h-full justify-between">
              <div className="player-menu">
                <div className="">Me</div>
                <div className="">Opponent</div>
              </div>

              <div className="flex justify-center items-center">
                <div className=" flex justify-around w-full">
                  <Button variant="contained" color="error" href="/">
                    Quit
                  </Button>
                  <Button variant="contained" color="success">
                    Start Game
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3"></div>
      </div>

      <div className="col-span-12 row-span-1"></div>
    </div>
  );
};

export default GameLobby;
