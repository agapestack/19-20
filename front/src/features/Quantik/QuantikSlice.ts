import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  quantikConfig,
  ShapeType,
  SideType,
  IQuantikPiece,
  IQuantikState,
  sideTypes,
  IPlayerConfig,
  ISelectedPiece,
} from "../../config/quantik.config";
import {
  initQuantikBoard,
  initPlayerPieces,
  linearize,
  playerHasAvailableMove,
  isMoveValid,
  initPlayerList,
  isWinningMove,
} from "../../utils/quantik.utils";
import type { RootState } from "../../app/store";
import { toast } from "react-toastify";

// Action types
export interface PlaceShapeActionType {
  posX: number;
  posY: number;
  shape: ShapeType;
  side: SideType;
}

export interface SelectShapeActionType {
  shape: ShapeType;
  side: SideType;
}

export interface PlacePieceActionType {
  piece: IQuantikPiece;
  posX: number;
  posY: number;
}

export interface PieceActionType {
  piece: IQuantikPiece;
}

export interface DebugSwitchSideActionType {
  side: SideType;
}

export interface SetMenuState {
  newState: number;
}

export interface SetReplayTurn {
  newTurn: number;
}

export interface UpdatePlayerListActionType {
  newPlayerList: IPlayerConfig[];
}

const initialState: IQuantikState = {
  playerList: initPlayerList(),
  player: 0,
  board: linearize(
    initQuantikBoard(quantikConfig.nbRow, quantikConfig.nbColumn)
  ),
  selectedPiece: -1,
  nbPiece: 0,
  pieces: {
    white: initPlayerPieces(sideTypes.white),
    black: initPlayerPieces(sideTypes.black),
  },
  history: [],
  winningCells: [],
  menuState: 2,
  replayTurn: 0,
};

export const quantikSlice = createSlice({
  name: "quantik",
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<UpdatePlayerListActionType>) => {
      for (let i = 0; i < state.playerList.length; i++) {
        state.playerList[i] = action.payload.newPlayerList[i];
      }
    },
    selectPiece: (state, action: PayloadAction<PieceActionType>) => {
      type ObjectKey = keyof typeof state.pieces;
      const playerSide = state.playerList[state.player].side as string;

      const cond = state.pieces[
        playerSide.toLowerCase() as ObjectKey
      ].pieces.find((piece) => {
        return piece.shape === action.payload.piece.shape && piece.pos.x === -1;
      });

      if (cond) {
        // const i =
        //   state.pieces[playerSide.toLowerCase() as ObjectKey].pieces.indexOf(
        //     cond
        //   );
        state.selectedPiece = { piece: cond } as ISelectedPiece;
      }
    },
    placePiece: (state, action: PayloadAction<PlacePieceActionType>) => {
      const moveValid = isMoveValid(state.board, action.payload.piece, {
        x: action.payload.posX,
        y: action.payload.posY,
      });

      if (moveValid) {
        type ObjectKey = keyof typeof state.pieces;
        const playerSide = state.playerList[state.player].side as string;

        const cond = state.pieces[
          playerSide.toLowerCase() as ObjectKey
        ].pieces.find((piece) => {
          return (
            piece.shape === action.payload.piece.shape && piece.pos.x === -1
          );
        });
        if (!cond) return;

        const i =
          state.pieces[playerSide.toLowerCase() as ObjectKey].pieces.indexOf(
            cond
          );
        state.pieces[playerSide.toLowerCase() as ObjectKey].pieces.splice(i, 1);

        cond.pos = {
          x: action.payload.posX,
          y: action.payload.posY,
        };

        state.board[cond.pos.y][cond.pos.x].piece = cond;

        // Can next player play?
        let p = playerHasAvailableMove(
          state.board,
          state.pieces[
            state.playerList[(state.player) ? 0 : 1].side.toLowerCase() as ObjectKey
          ]
        );

        // Cell was udpated with new piece, check if this is it
        const winningMove = isWinningMove(state.board, action.payload.piece, {
          x: action.payload.posX,
          y: action.payload.posY,
        });
        const winningPlayerName = state.playerList[state.player].name;

        if (winningMove.res) {
          state.winningCells = winningMove.winningCells;
          state.menuState = 3;
          toast.success(
            `Winning move by ${winningPlayerName}! Congratulations!`
          );
        }

        if (!p) {
          state.menuState = 3;
          toast.error(
            `${state.playerList[(state.player) ? 0 : 1].name} can't play! ${state.playerList[state.player].name} wins!`
          );
        }

        state.history = [
          ...state.history,
          {
            board: JSON.parse(JSON.stringify(state.board)),
            move: JSON.parse(JSON.stringify(cond)),
            index: state.history.length
          },
        ];

        state.selectedPiece = -1;

        // Switch player
        state.player = state.player ? 0 : 1;
        //toast.info(`À ton tour ${state.playerList[state.player].name} !`);
      } else {
        toast.error(
          `Couldn't place piece ${state.playerList[state.player].side} ${
            action.payload.piece.shape
          } at (${action.payload.posX}, ${action.payload.posY})`
        );
      }
    },
    updateMenuState: (state, action: PayloadAction<SetMenuState>) => {
      state.menuState = action.payload.newState;
    },
    updateReplayTurn: (state, action: PayloadAction<SetReplayTurn>) => {
      state.replayTurn = action.payload.newTurn;
    },
    reset: () => initialState,
  },
});

export const {
  setPlayers,
  selectPiece,
  placePiece,
  updateMenuState,
  updateReplayTurn,
  reset,
} = quantikSlice.actions;
export const selectQuantik = (state: RootState) => state.quantik;
export default quantikSlice.reducer;
