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
  // KULAMI_MENU,
  gameStatusObject,
  PositionDataInterface,
  tileTypes,
} from "../../config/kulami.config";
import type { RootState } from "../../app/store";
import { extractTileSize, isLastTile, isTileNextToAnother, isMoveValid, winTile, getNbPawnAdjacent, isTileFit, isEnoughSpace } from "../../utils/kulami.utils";
import { toast } from "react-toastify";
import { generateInitBoardArray, tileColorArray } from "../../utils/utils";
import Swal from "sweetalert2";



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
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
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

      if (!isMoveValid(state.boardTileArray, state.boardPawnArray, posX, posY, state.nbRedPawn, state.nbBlackPawn, state.positionStack)) { 
        toast.error("Move invalid!");
        return ;
      }
      switch (state.player) {
        case RED:
          if (state.nbRedPawn === 0) {
            toast.error("Out of red pawn!");
            return;
          }
          state.boardPawnArray[posX][posY] = RED;
          state.nbRedPawn--;
          state.player = BLACK;
          break;
        case BLACK:
          if (state.nbBlackPawn === 0) {
            toast.error("Out of black pawn!");
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
      state.status = gameStatusObject.END_GAME;
      let stringWinner = '';

      for (let i = 0; i < state.tileStack.length; i++) {
        let winner = winTile(state.boardTileArray, state.boardPawnArray, i);
        if (!winner) {
          continue;
        }
        let point = 0;
        switch(state.tileStack[i].tileType) {
          case tileTypes.tile_1x2:
          case tileTypes.tile_2x1:
            point = 2;
            break;
          case tileTypes.tile_3x1:
          case tileTypes.tile_1x3:
            point = 3;
            break;
          case tileTypes.tile_2x2:
            point = 4;
            break;
          case tileTypes.tile_2x3:
          case tileTypes.tile_3x2:
            point = 6;
            break;
          default:
        }

        if (winner === RED) {
          stringWinner = 'Red'
          state.redScore += point;
        } 
        else if (winner === BLACK) {
          stringWinner = 'Black'
          state.blackScore += point;
        }
        else { stringWinner = 'Neither player' }

        alert(stringWinner + ' has won tile ' + i + ' for ' + point + ' points')
      }

      //Advanced game rules level 1
      const bonus = 5;
      let nbRedPawnAdj = getNbPawnAdjacent(state.boardPawnArray, RED);
      let nbBlackPawnAdj = getNbPawnAdjacent(state.boardPawnArray, BLACK);
      console.log('nbRedAdj: ' + nbRedPawnAdj, 'nbBlackAdj: ' + nbBlackPawnAdj);

      if (nbRedPawnAdj > nbBlackPawnAdj) {
        stringWinner = 'Red';
        state.redScore += bonus;
      } 
      else if (nbRedPawnAdj < nbBlackPawnAdj) {
        stringWinner = 'Black';
        state.blackScore += bonus;
      }
      alert(stringWinner + ' won ' + bonus + ' points bonus');
      console.log('AFTER BONUS - red: ' + state.redScore, 'black: ' + state.blackScore);
    },

    getWinner: (state) => {
      if (state.redScore > state.blackScore) {
        state.status = gameStatusObject.RED_WINS;
        toast.success("Red Wins");
        return;
      }
      if (state.redScore < state.blackScore) {
        state.status = gameStatusObject.BLACK_WINS;
        toast.success("Black Wins");
        return;
      }
      toast.success("Tie");
      return;
    },
    // updateMenuState: (state, action: PayloadAction<KULAMI_MENU>) => {
    //   state.menu = action.payload;
    // },
    reset: () => initialState,
  },
});

export const {
  placeTile,
  selectTile,
  turnTile,
  startGame,
  placePawn,
  getScore,
  getWinner,
  // updateMenuState,
  reset
} = kulamiSlice.actions;
export const selectKulami = (state: RootState) => state.kulami;

export default kulamiSlice.reducer;
