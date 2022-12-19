import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  TileType,
  KulamiStateInterface,
  kulamiConfig,
  TileDataInterface,
  BOARD_EMPTY_VALUE,
  kulamiMenuObject,
} from "../../config/kulami.config";
import type { RootState } from "../../app/store";
import { extractTileSize, isTileNextToAnother } from "../../utils/kulami.utils";
import { toast } from "react-toastify";
import { generateInitBoardArray } from "../../utils/board.utils";
import { tileColorArray } from "../../utils/utils";

// ACTION TYPE
export interface PlaceTileActionType {
  posX: number;
  posY: number;
}

export interface SelectTileActionType {
  tileType: TileType;
}

const initialState: KulamiStateInterface = {
  menu: kulamiMenuObject.MENU_MAPPING,
  boardTileArray: generateInitBoardArray(
    kulamiConfig.nbRow,
    kulamiConfig.nbColumn
  ),
  nbTile: 0,
  selectedTile: null,
  tileStack: [],
};

export const kulamiSlice = createSlice({
  name: "kulami",
  initialState,
  reducers: {
    placeTile: (state, action: PayloadAction<PlaceTileActionType>) => {
      if (state.selectedTile !== null) {
        const { posX, posY } = action.payload;

        const size = extractTileSize(state.selectedTile);
        const [width, height] = size;

        // verify that piece fit the board
        if (
          posX + size[0] > kulamiConfig.nbRow ||
          posY + size[1] > kulamiConfig.nbColumn
        ) {
          toast.error("Tile exceed the board");
          return;
        }

        // verify that all necessary square are available
        for (let i = 0; i < size[0]; i++) {
          for (let j = 0; j < size[1]; j++) {
            if (
              state.boardTileArray[posX + i][posY + j] !== BOARD_EMPTY_VALUE
            ) {
              toast.error("No available space");
              return;
            }
          }
        }

        // verify that tile is next to another
        if (
          state.nbTile > 0 &&
          !isTileNextToAnother(posX, posY, width, height, state.boardTileArray)
        ) {
          toast.error("Can't place a tile that is not next to another");
          return;
        }

        // tileObject --> tilestack
        let tileObject: TileDataInterface = {
          tileType: (String(posX) + "-" + String(posY)) as TileType,
          posList: [] as number[][],
          color: tileColorArray[state.nbTile + 1],
        };

        // set square state && update tileObject.posList
        for (let i = 0; i < size[0]; i++) {
          for (let j = 0; j < size[1]; j++) {
            state.boardTileArray[posX + i][posY + j] = state.nbTile;
            tileObject.posList.push([posX + i, posY + j]);
          }
        }

        // adding tileObject to tilestack
        state.tileStack.unshift(tileObject);
        state.nbTile += 1;

        toast.success("Tile successfully placed");
      }
    },
    selectTile: (state, action: PayloadAction<TileType>) => {
      state.selectedTile = action.payload;
    },
    turnTile: (state) => {
      if (state.selectedTile !== null) {
        let reversed =
          state.selectedTile[2] + state.selectedTile[1] + state.selectedTile[0];
        state.selectedTile = reversed as TileType;
      }
    },
    removeLastTile: (state) => {},
  },
});

export const { placeTile, selectTile, turnTile, removeLastTile } =
  kulamiSlice.actions;
export const selectKulami = (state: RootState) => state.kulami;

export default kulamiSlice.reducer;
