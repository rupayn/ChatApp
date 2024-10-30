import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  UserStatus: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state,action) => {
      state.UserStatus = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.UserStatus = false;
      state.userData = null;
    },
    user:(state,action) =>{
      console.log(action.payload);
        state.userData = action.payload;
    }
  },
});

export const { login, logout, user } = authSlice.actions;

export default authSlice;
