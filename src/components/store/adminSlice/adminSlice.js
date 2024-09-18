import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    adminState: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export default adminSlice.reducer;
export const { adminState } = adminSlice.actions;
