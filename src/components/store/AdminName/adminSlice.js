import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
};

const adminName = createSlice({
  name: "adminName",
  initialState,
  reducers: {
    nameState: (state, action) => {
      state.name = action.payload;
    },
  },
});

export default adminName.reducer;
export const { nameState } = adminName.actions;
