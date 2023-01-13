import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TileType,
  KulamiStateInterface,
  kulamiConfig,
  TileDataInterface,
  kulamiMenuObject,
  RED,
  BLACK,
  gameStatusObject,
  PositionDataInterface,
  tileTypes, KULAMI_MENU
} from "../../config/kulami.config";
import type { RootState } from "../../app/store";
import {
  extractTileSize,
  isEndGame,
  isEnoughSpace,
  isLastTile,
  isTileFit,
  isTileNextToAnother,
} from "../../utils/kulami.utils";
import { generateInitBoardArray, tileColorArray } from "../../utils/utils";
import { toast } from "react-toastify";

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
}

const initialState: KulamiStateInterface = {
  // MAPPING
  menu: kulamiMenuObject.MENU_MAPPING,
  boardTileArray: generateInitBoardArray(
    kulamiConfig.nbRow,
    kulamiConfig.nbColumn
  ),
  nbTile: 0,
  selectedTile: null,
  tileStack: [],
  nbTile2Toltal: kulamiConfig.nbTile_2box,
  nbTile3Toltal: kulamiConfig.nbTile_3box,
  nbTile4Toltal: kulamiConfig.nbTile_4box,
  nbTile6Toltal: kulamiConfig.nbTile_6box,

  // PLAY
  player: RED,
  nbRedPawn: kulamiConfig.nbTotalRedPawn,
  nbBlackPawn: kulamiConfig.nbTotalBlackPawn,

  status: gameStatusObject.IN_PROGRESS,
  boardPawnArray: generateInitBoardArray(
    kulamiConfig.nbRow,
    kulamiConfig.nbColumn
  ),
  positionStack: [],
  redScore: 0,
  blackScore: 0,
};

export const kulamiSlice = createSlice({
  name: "kulami",
  initialState,
  reducers: {
    placeTile: (state, action: PayloadAction<PlaceTileActionType>) => {
      if (state.selectedTile !== null) {
        const { posX, posY } = action.payload;

        const [width, height] = extractTileSize(state.selectedTile);

        // verify that the number of tiles has reached the maximum
        if (state.nbTile === kulamiConfig.nbTotalTiles) {
          toast.error("You reache the maximum number of tiles");
          return;
        }

        // verify that piece fit the board
        if (!isTileFit(posX, posY, width, height)) {
          toast.error("Tile exceed the board");
          return;
        }

        // verify that all necessary square are available
        if (!isEnoughSpace(state.boardTileArray, posX, posY, width, height)) {
          toast.error("Not enough space");
          return;
        }

        // verify that tile is next to another
        // if (
        //   state.nbTile > 0 &&
        //   !isTileNextToAnother(posX, posY, width, height, state.boardTileArray)
        // ) {
        //   toast.error("Can't place a tile that is not next to another");
        //   return;
        // }

        switch (state.selectedTile) {
          case tileTypes.tile_1x2:
          case tileTypes.tile_2x1:
            if (!state.nbTile2Toltal) {
              toast.error("Out of tile this type !");
              return;
            }
            state.nbTile2Toltal--;
            break;
          case tileTypes.tile_3x1:
          case tileTypes.tile_1x3:
            if (!state.nbTile3Toltal) {
              toast.error("Out of tile this type !");
              return;
            }
            state.nbTile3Toltal--;
            break;
          case tileTypes.tile_2x2:
            if (!state.nbTile4Toltal) {
              toast.error("Out of tile this type !");
              return;
            }
            state.nbTile4Toltal--;
            break;
          case tileTypes.tile_2x3:
          case tileTypes.tile_3x2:
            if (!state.nbTile6Toltal) {
              toast.error("Out of tile this type !");
              return;
            }
            state.nbTile6Toltal--;
            break;
          default:
        }

        // tileObject --> tilestack
        let tileObject: TileDataInterface = {
          tileType: state.selectedTile,
          tilePos: String(posX) + "-" + String(posY),
          posList: [] as number[][],
          color: tileColorArray[state.nbTile + 1],
        };

        // set square state && update tileObject.posList
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            state.boardTileArray[posX + i][posY + j] = state.nbTile;
            tileObject.posList.push([posX + i, posY + j]);
          }
        }

        // adding tileObject to tilestack
        state.tileStack.unshift(tileObject);
        state.nbTile += 1;

        // toast.success("Tile successfully placed");
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

      if (state.player === RED) {
        if (state.nbRedPawn === 0) {
          toast.error("Out of red pawn!");
          return;
        }
        state.boardPawnArray[posX][posY] = RED;
        state.nbRedPawn--;
        state.player = BLACK;
      } else {
        if (state.nbBlackPawn === 0) {
          toast.error("Out of black pawn!");
          return;
        }
        state.boardPawnArray[posX][posY] = BLACK;
        state.nbBlackPawn--;
        state.player = RED;
      }

      // Add position to history log
      let positionObject: PositionDataInterface = {
        posX: posX,
        posY: posY,
        player: state.player,
      };

      state.positionStack.unshift(positionObject);
      // toast.success("Pawn successfully placed");

      // Check if end game move
      if (
        isEndGame(
          state.boardTileArray,
          state.boardPawnArray,
          state.nbRedPawn,
          state.nbBlackPawn,
          state.positionStack
        )
      ) {
        state.status = "END_GAME";
      }
    },
    setScore: (state, action: PayloadAction<[number, number]>) => {
      state.redScore = action.payload[0];
      state.blackScore = action.payload[1];
    },
    setMenu: (state, action: PayloadAction<KULAMI_MENU>) => {
      state.menu = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  placeTile,
  selectTile,
  turnTile,
  startGame,
  placePawn,
  setScore,
  setMenu,
  reset,
} = kulamiSlice.actions;
export const selectKulami = (state: RootState) => state.kulami;

export default kulamiSlice.reducer;
