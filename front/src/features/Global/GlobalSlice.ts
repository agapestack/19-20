import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  GameDetail,
  GlobalStateInterface,
} from "../../config/global.config";

const initialState: GlobalStateInterface = {
  gameChoice: 0,
  username: "",
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
    }
  },
});

export const {incrementGameChoice, decrementGameChoice, updateUsername} = globalSlice.actions;
export const selectGlobal = (state: RootState) => state.global;

export default globalSlice.reducer;
