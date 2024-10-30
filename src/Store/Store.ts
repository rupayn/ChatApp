import {configureStore} from "@reduxjs/toolkit"
import themeSlice from "./ThemeSlice"
import authSlice from "./AuthSlice"
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    [authSlice.name]: authSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

