import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connection: "",
  },
  reducers: {
    InitiateSocket: (state, action) => {
      console.log("INITIALISE SOCKET: ", action.payload);
      state.connection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { InitiateSocket } = socketSlice.actions;

export default socketSlice.reducer;
