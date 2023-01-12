import { useEffect, useState } from "react";

// Material UI
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";

import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { extractTileSize } from "../../../utils/kulami.utils";
import { tileColorArray } from "../../../utils/utils";
import { selectTile, startGame, turnTile } from "../KulamiSlice";
import SelectedTile from "./mapping/SelectedTile";
import TileStack from "./mapping/TileStack";


const KulamiMappingMenu = () => {
  const [nextTileColor, setNextTileColor] = useState<string>("");
  const kulami = useAppSelector((state) => state.kulami);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const squareColor = tileColorArray[kulami.nbTile];
    setNextTileColor(squareColor);
  }, [kulami.nbTile]);

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

          <div className="flex flex-col justify-aroundrow-span-2">
            <Button onClick={() => dispatch(turnTile())}>
              <div className="flex justify-center items-center">
                <span className="mx-2">Turn tile</span>
                <RefreshIcon></RefreshIcon>
              </div>
            </Button>

            <div className="flex justify-center items-center">
              {" "}
              <Button onClick={() => dispatch(selectTile("2-2"))}>
                <div className="grid grid-cols-2 grid-rows-2 border-1 hover:scale-110 ease-in-out duration-300">
                  {[...Array(4)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("3-1"))}>
                <div className="grid grid-cols-3 grid-rows-1 border-1 hover:scale-110 ease-in-out duration-300">
                  {[...Array(3)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("2-3"))}>
                <div className="grid grid-cols-2 grid-rows-3 border-1 hover:scale-110 ease-in-out duration-300">
                  {[...Array(6)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
              <Button onClick={() => dispatch(selectTile("1-2"))}>
                <div className="grid grid-cols-1 grid-rows-2 border-1 hover:scale-110 ease-in-out duration-300">
                  {[...Array(2)].map((_) => (
                    <div className="w-4 h-4 border-1 border-black"></div>
                  ))}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="my-4 h-80">
            <TileStack></TileStack>
        </div>
        <div className="mt-20">
          <Button variant="contained" onClick={() => dispatch(startGame())}>Start Game!</Button>
        </div>
      </div>
      
    </div>
  );
};

export default KulamiMappingMenu;
