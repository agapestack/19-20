import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import { Link } from "react-router-dom";
import PlayerTurn from '../player/PlayerTurn';
import HistoryLog from "./mapping/HistoryLog";


const KulamiPlayMenu = () => {
  return (
    <div className="w-full h-full grid-rows-6 bg-slate-400">
      <div className="flex flex-col justify-around items-center row-span-2">
        <div className="flex">
          <Button>
            <Link to="/">
              <HomeIcon></HomeIcon>
              <span>Homepage</span>
            </Link>
          </Button>
        </div>

        <div className="card h-full w-full m-4 border-2 rounded-lg ">
            <h1 className="text-center font-bold text-lg">Your turn !</h1>
            <div className="flex justify-center items-center h-64 w-64 mx-auto">
                <PlayerTurn></PlayerTurn>
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="">
            <HistoryLog></HistoryLog>
        </div>
      </div>
    </div>
  );
};

export default KulamiPlayMenu;