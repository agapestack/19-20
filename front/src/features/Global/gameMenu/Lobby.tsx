import { Button, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const Lobby = () => {
  const global = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="">
        <img src="" alt="" />
      </div>

      <div className="flex">
        {/* parameter */}
        <div className="flex justify-center items-center">
          <Typography>Parameters</Typography>
        </div>

        {/* players */}
        <div className="flex flex-col">
          <div className="">
            {global.username}
          </div>

          <div className="">
            player2
          </div>
        </div>
      </div>

      <div className="">
        <Button variant="contained" color="success">
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
