import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  ChatMessage,
  GameDetail, PlayerAvatar,
  PlayerType
} from "../../config/global.config";

export interface GlobalStateInterface {
  // gameChoice is the index of the selected game in GameDetail
  gameChoice: number;
  roomID: string;
  chat: ChatMessage[];
  me: PlayerType;
  opponent: PlayerType;
  meHasJoin: boolean;
  opponentHasJoin: boolean;
  hasStarted: boolean;
}

const initialState: GlobalStateInterface = {
  gameChoice: 0,
  roomID: "",
  chat: [],
  me: { avatarID: 0, username: "" },
  opponent: { avatarID: 0, username: "" },
  meHasJoin: false,
  opponentHasJoin: false,
  hasStarted: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    incrementGameChoice: (state) => {
      state.gameChoice = (state.gameChoice + 1) % GameDetail.length;
    },
    decrementGameChoice: (state) => {
      if (state.gameChoice === 0) {
        state.gameChoice = GameDetail.length - 1;
      } else {
        state.gameChoice -= 1;
      }
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomID = action.payload;
    },
    setGameChoice: (state, action: PayloadAction<number>) => {
      state.gameChoice = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.chat.length >= 10) {
        state.chat.pop();
      }
      state.chat.push(action.payload);
    },
    setOpponent: (state, action: PayloadAction<PlayerType>) => {
      state.opponent = action.payload;
    },
    incrementAvatarChoice: (state) => {
      state.me.avatarID += 1;
      state.me.avatarID = state.me.avatarID % PlayerAvatar.length;
    },
    decrementAvatarChoice: (state) => {
      state.me.avatarID -= 1;
      if (state.me.avatarID < 1) {
        state.me.avatarID = PlayerAvatar.length - 1;
      }
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.me.username = action.payload;
    },
    toggleMeHasJoin: (state) => {
      state.meHasJoin = !state.meHasJoin;
    },
    toggleOpponentHasJoin: (state) => {
      state.opponentHasJoin = !state.opponentHasJoin;
    },
    globalStartGame: (state) => {
      state.hasStarted = true;
    },
  },
});

export const {
  incrementGameChoice,
  decrementGameChoice,
  setRoomId,
  addMessage,
  incrementAvatarChoice,
  decrementAvatarChoice,
  setOpponent,
  setUsername,
  toggleMeHasJoin,
  toggleOpponentHasJoin,
  globalStartGame,
  setGameChoice,
} = globalSlice.actions;
export const selectGlobal = (state: RootState) => state.global;

export default globalSlice.reducer;
