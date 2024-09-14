import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  theme: string;
}

const initialState:ThemeState={
    theme:"dark",

}

const themeSlice = createSlice({
  name: "Theme",
  initialState,
  reducers: {
    darkMode: (state) => {
      state.theme = "dark";
    },
    lightMode: (state) => {
      state.theme = "light";
    },
  },
});

export const { darkMode, lightMode } = themeSlice.actions;
export default themeSlice.reducer;

