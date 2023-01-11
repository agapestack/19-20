import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  TileType,
  KulamiStateInterface,
  kulamiConfig,
  TileDataInterface,
  BOARD_EMPTY_VALUE,
  kulamiMenuObject,
  RED,
  BLACK,
  gameStatusObject,
  PositionDataInterface,
  tileTypes,
} from "../../config/kulami.config";
import type { RootState } from "../../app/store";
import { extractTileSize, isFirstMove, isLastTile, isTileNextToAnother, winTile } from "../../utils/kulami.utils";
import { toast } from "react-toastify";
import { generateInitBoardArray, tileColorArray } from "../../utils/utils";
import { KeyboardReturnOutlined, ThermostatSharp } from "@mui/icons-material";

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
  placedTile: null,
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

        const size = extractTileSize(state.selectedTile);
        const [width, height] = size;

        // verify that the number of tiles has reached the maximum
        if (state.nbTile === kulamiConfig.nbTotalTiles) {
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

        switch(state.selectedTile){
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
          tilePos: (String(posX) + "-" + String(posY)),
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
        console.log(JSON.stringify(state.boardTileArray));
                
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

      // verify that can't play outside of the field
      if (state.boardTileArray[posX][posY] === BOARD_EMPTY_VALUE) {
        toast.error("You can't play outside of the game field !");
        return;
      }
      // verify that the square is available
      if (state.boardPawnArray[posX][posY] !== BOARD_EMPTY_VALUE) {
        toast.error("There is already a piece here !");
        return;
      }
      if (!isFirstMove(state.nbRedPawn, state.nbBlackPawn)) {
        // verify that can't play in the same tile and the tile before
        if (
          state.boardTileArray[posX][posY] ===
          state.boardTileArray[state.positionStack[0].posX][state.positionStack[0].posY]
        ) {
          toast.error("You can't play in this tile !");
          return;
        }

        if (state.positionStack.length > 1) {
          if (
              state.boardTileArray[posX][posY] ===
              state.boardTileArray[state.positionStack[1].posX][state.positionStack[1].posY]
          ) {
            toast.error("You can't play in the previous tile !");
            return;
          }
      }

        // verify that can only play relative to the last position played
        if (
          posX !== state.positionStack[0].posX &&
          posY !== state.positionStack[0].posY
        ) {
          toast.error("You can only play in highlighted area !");
          return;
        }

      }
      switch (state.player) {
        case RED:
          if (state.nbRedPawn === 0) {
            toast.error("Out of pawn !");
            return;
          }
          state.boardPawnArray[posX][posY] = RED;
          state.nbRedPawn--;
          state.player = BLACK;
          break;
        case BLACK:
          if (state.nbBlackPawn === 0) {
            toast.error("Out of pawn !");
            return;
          }
          state.boardPawnArray[posX][posY] = BLACK;
          state.nbBlackPawn--;
          state.player = RED;
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

    getScore: (state) => {
      for (let i = 0; i < state.tileStack.length; i++) {
        var winner = winTile(state.boardTileArray, state.boardPawnArray, i);
        if (!winner) {continue;}

        switch(state.tileStack[i].tileType) {
          case tileTypes.tile_1x2:
          case tileTypes.tile_2x1:
            (winner === RED) ? state.redScore += 2 : state.blackScore += 2;
            break;
          case tileTypes.tile_3x1:
          case tileTypes.tile_1x3:
            (winner === RED) ? state.redScore += 3 : state.blackScore += 3;
            break;
          case tileTypes.tile_2x2:
            (winner === RED) ? state.redScore += 4 : state.blackScore += 4;
            break;
          case tileTypes.tile_2x3:
          case tileTypes.tile_3x2:
            (winner === RED) ? state.redScore += 6 : state.blackScore += 6;
            break;
          default:
        }
      }
    },

    getWinner: (state) => {
      state.status = (state.redScore > state.blackScore) ? gameStatusObject.RED_WINS : gameStatusObject.BLACK_WINS;
      console.log("red " + state.redScore);
      console.log("black " + state.blackScore)
      if (state.status === gameStatusObject.RED_WINS) {
        toast.success("Red Wins");
        return;
      }
      toast.success("Black Win");
      return;
    }
  },
});

export const {
  placeTile,
  selectTile,
  turnTile,
  startGame,
  placePawn,
  getScore,
  getWinner
} = kulamiSlice.actions;
export const selectKulami = (state: RootState) => state.kulami;

export default kulamiSlice.reducer;
