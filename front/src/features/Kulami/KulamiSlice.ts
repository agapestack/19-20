import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { RootState } from "../../app/store";
import {
  BLACK, BOARD_EMPTY_VALUE, gameStatusObject, kulamiConfig, kulamiMenuObject, KulamiStateInterface, PositionDataInterface, RED, TileDataInterface, TileType
} from "../../config/kulami.config";
import { extractTileSize, isFirstMove, isLastTile, isTileNextToAnother } from "../../utils/kulami.utils";
import { generateInitBoardArray, tileColorArray } from "../../utils/utils";

// ACTION TYPE
export interface PlaceTileActionType {
  posX: number;
  posY: number;
}

export interface SelectTileActionType {
  tileType: TileType;
}

export interface PlacePawnActionType {
  posX: number;
  posY: number;
  // prevPosX: number;
  // prevPosY: number;
  // prevNbTile: number;
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

  // PLAY
  player: RED,
  nbRedPawn: kulamiConfig.nbTotalRedPawn,
  nbBlackPawn: kulamiConfig.nbTotalBlackPawn,
  status: gameStatusObject.IN_PROGRESS,
  boardPawnArray: generateInitBoardArray(
    kulamiConfig.nbRow,
    kulamiConfig.nbColumn
  ),
  placedTile: null,
  positionStack: [],
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

        // verify that the number of tiles has reached the maximum
        if (state.nbTile === 17) {
          toast.error("You reache the maximum number of tiles");
          return;
        }

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
    startGame: (state) => {
      if (isLastTile(state.nbTile)) {
        toast.success("Game start!");
        state.menu = kulamiMenuObject.MENU_PLAY;
      } else {
        toast.error("You haven't placed all the tile");
      }
    },
    placePawn: (state, action: PayloadAction<PlacePawnActionType>) => {
      const { posX, posY } = action.payload;
      // let prevPosX = state.positionStack[0].posX;
      // let prevPosY = state.positionStack[0].posY;

      // verify that can't play outside of the field
      if (state.boardTileArray[posX][posY] === BOARD_EMPTY_VALUE) {
        toast.error("You can't play outside of the game field !");
        return;
      }
      if (!isFirstMove(state.nbRedPawn, state.nbBlackPawn)) {
        // verify that the square is available
        if (state.boardPawnArray[posX][posY] !== BOARD_EMPTY_VALUE) {
          toast.error("There is already a piece here !");
          return;
        }

        // verify that can only play relative to the last position played
        if (
          posX !== state.positionStack[0].posX &&
          posY !== state.positionStack[0].posY
        ) {
          toast.error("You can only play in highlighted area !");
          return;
        }

        // verify that can't play in the same tile
        if (
          state.boardTileArray[posX][posY] ===
          state.boardTileArray[state.positionStack[0].posX][
            state.positionStack[0].posY
          ]
        ) {
          toast.error("You can't play in the same tile !");
          return;
        }
      }
      switch (state.player) {
        case RED:
          state.boardPawnArray[posX][posY] = RED;
          state.nbRedPawn--;
          break;
        case BLACK:
          state.boardPawnArray[posX][posY] = BLACK;
          state.nbBlackPawn--;
          break;
        default:
      }

      // Add position to history log
      let positionObject: PositionDataInterface = {
        posX: posX,
        posY: posY,
        player: state.player,
      };

      state.positionStack.unshift(positionObject);

      toast.success("Pawn successfully placed");
    },
  },
});

export const {
  placeTile,
  selectTile,
  turnTile,
  removeLastTile,
  startGame,
  placePawn,
} = kulamiSlice.actions;
export const selectKulami = (state: RootState) => state.kulami;

export default kulamiSlice.reducer;
