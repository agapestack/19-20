import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import { Button, Dialog, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import HistoryLog from "./mapping/HistoryLog";
import { reset, setScore } from "../KulamiSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectKulami } from "../KulamiSlice";
import {
  BLACK,
  MarbleAssets,
  RED,
  tileWinDetail,
} from "../../../config/kulami.config";
import { useEffect, useState } from "react";
import {
  computeBonusWinner,
  computeScore,
  computeTileWinDetail,
} from "../../../utils/kulami.utils";

const KulamiPlayMenu = () => {
  const [showScoreDetails, setShowScoreDetails] = useState<boolean>(false);
  const [bonusWinner, setBonusWinner] = useState<number>(-1);
  const [tileWinArray, setTileWinArray] = useState<tileWinDetail[]>([]);
  const kulami = useAppSelector(selectKulami);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (kulami.status === "END_GAME") {
      handleEndGame();
      setShowScoreDetails(true)
    }
  }, [kulami.status]);
  
  const handleEndGame = () => {
    let tileWinArray = computeTileWinDetail(
      kulami.boardTileArray,
      kulami.boardPawnArray,
      kulami.tileStack
    );

    setTileWinArray(tileWinArray);
    let [p1Score, p2Score] = computeScore(tileWinArray, kulami.boardPawnArray);
    setBonusWinner(computeBonusWinner(kulami.boardPawnArray));

    dispatch(setScore([p1Score, p2Score]));
    setShowScoreDetails(true);
  };

  return (
    <div className="w-full h-screen grid-rows-2 bg-gray-200">
      <div className="row-span-1 flex flex-col justify-around items-center">
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
            <img
              className="h-max w-max"
              src={
                kulami.player === RED
                  ? process.env.PUBLIC_URL + MarbleAssets.redMarble
                  : process.env.PUBLIC_URL + MarbleAssets.blackMarble
              }
              alt="marble"
            />
          </div>
          <div className="flex justify-center items-center font-bold">
            Number of marbles left :
            {kulami.player === RED ? kulami.nbRedPawn : kulami.nbBlackPawn}
          </div>
        </div>
      </div>

      <div className="row-span-1 flex flex-col justify-between items-center h-1/2">
        <div className="my-4 h-full w-80 overflow-auto bg-slate-300 rounded-md">
        <h1 className="text-center font-bold text-lg">History Log</h1>
          <HistoryLog></HistoryLog>
        </div>
        <div className="flex items-center justify-center py-4">
          <div className="mx-4">
            <Button variant="contained" onClick={handleEndGame}>
              End Game
            </Button>
          </div>
          <div className="mx-4">
            <Button variant="contained" onClick={() => dispatch(reset())}>
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* ______________SCORE DIALOG____________________ */}

      <Dialog
        open={showScoreDetails}
        onClose={() => setShowScoreDetails(false)}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="flex items-center justify-around h-50 w-50 p-8 border-2 border-b-blue-700">
          <div className="text-3xl flex justify-center items-center flex-col">
            <img
              className="w-16 h-16"
              src={process.env.PUBLIC_URL + MarbleAssets.redMarble}
              alt="marble"
            />
            <h1 className="my- mr-2">Player 1</h1>
          </div>
          <div className="text-3xl flex justify-center items-center flex-col">
            <img
              className="w-16 h-16"
              src={process.env.PUBLIC_URL + MarbleAssets.blackMarble}
              alt="marble"
            />
            <h1 className="my- ml-2">Player 2</h1>
          </div>
        </div>
          {/* <div className="row-span-3 grid grid-rows-4 border-t-2 border-blue-700"> */}
            {/* <div className="row-span-1 text-4xl text-center  mt-4 ">
              Tiles won
            </div> */}

            {/* <div className="row-span-3 grid grid-cols-2 ">
              <div className="mx-4">
                {tileWinArray
                  .filter((e) => e.player === RED)
                  .map((e, i) => (
                    <div>
                      {/* <MiniTile
                        tileType={kulami.tileStack[e.tileID].tileType}
                        color={kulami.tileStack[e.tileID].color}
                      ></MiniTile> 
                      <div className="grid grid-cols-1 grid-rows-2 border-1 pl-0 hover:scale-110 ease-in-out duration-300">
                        {[...Array()].map((_) => (
                          <div className="w-4 h-4 border-1 border-black"></div>
                        ))}
                </div>
                    </div>
                  ))}
              </div>

              <div className="mx-4 ">
                {tileWinArray
                  .filter((e) => e.player === BLACK)
                  .map((e, i) => (
                    {kulami.tileStack[e.tileID].tileType}
                    {kulami.tileStack[e.tileID].color}
                  ))}
              </div>
            </div> */}
          {/* </div> */}

            <div className="col-span-2 text-4xl text-center mt-4">
              Score
            </div>

            <div className="col-span-2 flex justify-around items-center p-8">
              <div className="px-6 py-4 bg-gray-100 flex justify-center items-center flex-col w-full h-full mr-2">
                {(kulami.redScore > kulami.blackScore) && (
                  <div className="text-2xl text-green-600">Winner</div>
                )}
                {(kulami.redScore < kulami.blackScore) && (
                  <div className="text-2xl text-red-600">Loser</div>
                )}
                 {(kulami.redScore === kulami.blackScore) && (
                  <div className="text-2xl text-yellow-600">Tie</div>
                )}

                <div className="text-3xl font-medium flex">
                  {kulami.redScore}
                  {bonusWinner === RED && (
                    <Tooltip
                      placement="top"
                      title={<h1 style={{ fontSize: "20px" }}>Won bonus</h1>}
                    >
                      <StarIcon className="relative mt-1"  style={{ color: "#FAC627" }}></StarIcon>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-100 flex justify-center items-center flex-col w-full h-full ml-2">
              {(kulami.redScore < kulami.blackScore) && (
                  <div className="text-2xl text-green-600">Winner</div>
                )}
                {(kulami.redScore > kulami.blackScore) && (
                  <div className="text-2xl text-red-600">Loser</div>
                )}
                 {(kulami.redScore === kulami.blackScore) && (
                  <div className="text-2xl text-yellow-600">Tie</div>
                )}

                <div className="text-3xl font-medium flex">
                  {kulami.blackScore}
                  {bonusWinner === BLACK && (
                    <Tooltip
                      placement="top"
                      title={<h1 style={{ fontSize: "20px" }}>Won bonus</h1>}
                    >
                      <StarIcon className="relative mt-1" style={{ color: "#FAC627" }}></StarIcon>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

        
      </Dialog>
    </div>
  );
};

export default KulamiPlayMenu;
