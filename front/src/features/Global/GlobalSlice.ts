import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  GameDetail,
} from "../../config/global.config";

export interface GlobalStateInterface {
  // gameChoice is the index of the selected game in GameDetail
  gameChoice: number;
  username: string;
  roomID: string;
}


const initialState: GlobalStateInterface = {
  gameChoice: 0,
  username: "",
  roomID: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    incrementGameChoice: state => {
      state.gameChoice = (state.gameChoice + 1) % GameDetail.length
    },
    decrementGameChoice: state => {
      if(state.gameChoice === 0) {
        state.gameChoice = GameDetail.length - 1;
      } else {
        state.gameChoice -= 1;
      }
    }, 
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    }, 
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomID = action.payload;
    }
  },
});

export const {incrementGameChoice, decrementGameChoice, updateUsername, setRoomId} = globalSlice.actions;
export const selectGlobal = (state: RootState) => state.global;

export default globalSlice.reducer;
