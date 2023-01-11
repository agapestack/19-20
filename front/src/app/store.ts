import { configureStore } from "@reduxjs/toolkit";
import kulamiReducers from "../features/Kulami/KulamiSlice";
import globalReducers from "../features/Global/GlobalSlice";
import quantikReducers from "../features/Quantik/QuantikSlice";

export const store = configureStore({
  reducer: {
    kulami: kulamiReducers,
    global: globalReducers,
    quantik: quantikReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
