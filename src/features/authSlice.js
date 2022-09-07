import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: "",
  },
  reducers: {
    SignIn: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SignIn } = authSlice.actions;

export default authSlice.reducer;
