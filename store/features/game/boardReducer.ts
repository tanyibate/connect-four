import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ROWS, COLUMNS, EMPTY_CELL } from "../../../utils/constants";

const initialState: {
  value: number[][];
} = {
  value: Array(ROWS).fill(Array(COLUMNS).fill(EMPTY_CELL)),
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<number[][]>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBoard } = boardSlice.actions;

export default boardSlice.reducer;
