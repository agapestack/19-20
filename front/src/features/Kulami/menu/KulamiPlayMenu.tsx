import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import { Link } from "react-router-dom";
import HistoryLog from "./mapping/HistoryLog";
import { getScore, getWinner } from "../KulamiSlice";
import { useAppDispatch } from "../../../app/hooks";


const KulamiPlayMenu = () => {
  const dispatch = useAppDispatch();

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
                <img className='h-max w-max' src={process.env.PUBLIC_URL + "/kulami/kulami_marbleRed.png"} alt='marble' />
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="my-4 h-80">
            <HistoryLog></HistoryLog>
        </div>
        <div className="mt-20">
          <Button variant="contained" onClick={() => dispatch(getScore())}>Get Score</Button>
        </div>
        <div className="mt-20">
          <Button variant="contained" onClick={() => dispatch(getWinner())}>Get Winner</Button>
        </div>
      </div>
    </div>
  );
};

export default KulamiPlayMenu;