import { useEffect, useState } from "react";

// Material UI
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { reset, selectTile, startGame, turnTile } from "../KulamiSlice";
import SelectedTile from "./mapping/SelectedTile";
import { generateRandomString, tileColorArray } from "../../../utils/utils";
import { Link } from "react-router-dom";
import { extractTileSize } from "../../../utils/kulami.utils";
import { TileDataInterface } from "../../../config/kulami.config";

const KulamiMappingMenu = () => {
  const [nextTileColor, setNextTileColor] = useState<string>("");
  const kulami = useAppSelector((state) => state.kulami);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const squareColor = tileColorArray[kulami.nbTile];
    setNextTileColor(squareColor);
  }, [kulami.nbTile]);
  return (
    <div className="w-full grid grid-rows-2 bg-gray-200 overflow-x-hidden h-screen">
      <div className="row-span-1 flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mt-4">
          <Button>
            <Link to="/">
              <HomeIcon></HomeIcon>
              <span>Homepage</span>
            </Link>
          </Button>
        </div>

        <div className="card h-full w-full mb-4 border-2 rounded-none border-y-blue-700">
          <h1 className="text-center font-bold text-lg">Tile selection</h1>
          <div className="flex justify-center items-center h-64 w-64 mx-auto">
            {kulami.selectedTile !== null && (
              <SelectedTile
                cols={extractTileSize(kulami.selectedTile)[0]}
                rows={extractTileSize(kulami.selectedTile)[1]}
                color={nextTileColor}
              ></SelectedTile>
            )}
          </div>

          <div className="flex flex-col justify-around row-span-2">
            <Button onClick={() => dispatch(turnTile())}>
              <div className="flex justify-center items-center">
                <span className="mx-2">Turn tile</span>
                <RefreshIcon></RefreshIcon>
              </div>
            </Button>

            <div className="flex justify-center items-center grid grid-cols-4 grid-rows-2 ">
              {" "}
              <Button onClick={() => dispatch(selectTile("2-2"))}>
                <div className="grid grid-cols-2 grid-rows-2 border-1 pl-0 hover:scale-110 ease-in-out duration-300">
                  {[...Array(4)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("1-3"))}>
                <div className="grid grid-cols-1 grid-rows-3 border-1 pl-0 hover:scale-110 ease-in-out duration-300">
                  {[...Array(3)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("2-3"))}>
                <div className="grid grid-cols-2 grid-rows-3 border-1 pl-0 hover:scale-110 ease-in-out duration-300">
                  {[...Array(6)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("1-2"))}>
                <div className="grid grid-cols-1 grid-rows-2 border-1 pl-0 hover:scale-110 ease-in-out duration-300">
                  {[...Array(2)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <div className="flex justify-center">
                <p className="text-xl font-semibold bg-slate-300 px-2 rounded-md">
                  {kulami.nbTile4Toltal}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="text-xl font-semibold bg-slate-300 px-2 rounded-md">
                  {kulami.nbTile3Toltal}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="text-xl font-semibold bg-slate-300 px-2 rounded-md">
                  {kulami.nbTile6Toltal}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="text-xl font-semibold bg-slate-300 px-2 rounded-md">
                  {kulami.nbTile2Toltal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="row-span-1 flex flex-col justify-between items-center">
        <div className="my-4  bg-slate-300 rounded-md overflow-auto max-h-full px-8 py-4 w-80"> */}
      <div className="row-span-1 flex flex-col justify-between items-center">
        <div className="my-4 h-full w-80 overflow-auto bg-slate-300 rounded-md">
          {/* _______________TILE STACK________________________ */}
          <h1 className="text-center font-bold text-lg">History Log</h1>
          <div className="flex flex-col items-center">
            {kulami.tileStack.map((e: TileDataInterface, i: number) => (
              <div id={String(i) + generateRandomString(5)}>
                <p className="font-semibold">
                  Tile {e.tileType} at {e.tilePos}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="mx-4">
            <Button variant="contained" onClick={() => dispatch(startGame())}>
              Start Game
            </Button>
          </div>
          <div className="mx-4">
            <Button variant="contained" onClick={() => dispatch(reset())}>
              New Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KulamiMappingMenu;
