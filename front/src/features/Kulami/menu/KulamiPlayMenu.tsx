import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";

import { Link } from "react-router-dom";
import HistoryLog from "./mapping/HistoryLog";
import { getScore, getWinner, reset } from "../KulamiSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectKulami } from "../KulamiSlice";
import { BLACK, RED } from "../../../config/kulami.config";
import PlayerProfile from "../player/PlayerProfile";
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';


const KulamiPlayMenu = () => {
  const kulami = useAppSelector(selectKulami);
  const dispatch = useAppDispatch();

  const endGameActions = () => (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch(getScore());
    dispatch(getWinner());
  }

  return (
    <div className="w-full h-full grid-rows-6 bg-gray-200">
      <div className="flex flex-col justify-around items-center">
        <div className="flex">
          <Button>
            <Link to="/">
              <HomeIcon></HomeIcon>
              <span>Homepage</span>
            </Link>
          </Button>
        </div>

        <div className="card h-full w-full mb-4 border-2 rounded-none border-y-blue-700">
            <h1 className="text-center font-bold text-lg">Your turn !</h1>
            <div className="flex justify-center items-center h-64 w-64 mx-auto">
                <img className='h-max w-max' src={process.env.PUBLIC_URL + "/kulami/kulami_marbleRed.png"} alt='marble' />
            </div>
            <div className="flex justify-center items-center">
              Number of marble left :
              {(kulami.player === RED) ? kulami.nbRedPawn : kulami.nbBlackPawn}
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="my-4 h-80 w-80 overflow-auto bg-slate-300 rounded-md">
            <HistoryLog></HistoryLog>
        </div>
        <div className="flex items-center justify-center py-4">
          <div className="mx-4">
            <Button variant="contained" onClick={() => dispatch(endGameActions())}>End Game</Button>
          </div>
          <div className="mx-4">
            <Button variant="contained" onClick={() => dispatch(reset())}>New Game</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center">
        <PlayerProfile player={RED}></PlayerProfile>
        <PlayerProfile player={BLACK}></PlayerProfile>
      </div>
    </div>
  );
};

export default KulamiPlayMenu;