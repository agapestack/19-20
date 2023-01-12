import { Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../app/hooks";
import {
  BASE_URL,
  GameDetail,
  PlayerAvatar,
} from "../../../config/global.config";
import { setRoomId } from "../GlobalSlice";
import Chat from "../menu/Chat";
import Join from "../menu/Join";

const GameLobby = () => {
  const global = useAppSelector((state) => state.global);
  
  

  

  const handleShareRoom = () => {
    navigator.clipboard.writeText(BASE_URL + "/game/" + global.roomID);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-12 grid-rows-5 w-screen h-screen overflow-hidden background-color">
      <div className="col-span-12 row-span-1 flex justify-center items-center text-4xl">
        <img src={GameDetail[global.gameChoice].logoPath} alt="" />
      </div>

      <div className="col-span-12 row-span-3 grid grid-cols-12">
        <div className="col-span-3"></div>

        <div className="col-span-6 bg-white rounded-lg p-4 m-2">
          <div className="grid grid-cols-2 h-full">
            {/* chat */}
            <div className="flex">
              {!global.meHasJoin && <Join></Join>}
              {global.meHasJoin && <Chat></Chat>}
            </div>

            {/* players */}
            <div className="flex flex-col h-full justify-between">
              <div className="player-menu flex flex-col justify-center items-center mt-8">
                <div className="text-4xl mb-8">
                  <h1>Players</h1>
                </div>

                {global.meHasJoin && (
                  <div className="text-xl text-center">
                    <h3>{global.me.username}</h3>
                    <img
                      src={PlayerAvatar[global.me.avatarID].imgPath}
                      alt=""
                    />
                  </div>
                )}

                {global.opponentHasJoin && (
                  <div className="text-xl text-center">
                    <h3>{global.opponent.username}</h3>
                    <img
                      src={PlayerAvatar[global.opponent.avatarID].imgPath}
                      alt=""
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center">
                <div className=" flex flex-col justify-around">
                  <div className="">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleShareRoom}
                    >
                      Share room
                    </Button>
                  </div>

                  <Button variant="contained" color="error" href="/">
                    Leave lobby
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
