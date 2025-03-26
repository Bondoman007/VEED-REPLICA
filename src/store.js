import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./features/editorSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});
