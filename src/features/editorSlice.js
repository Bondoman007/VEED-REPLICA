// features/editor/editorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mediaItems: [],
  selectedItem: null,
  isPlaying: false,
  currentTime: 0,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addMediaItem: (state, action) => {
      state.mediaItems.push({
        id: Date.now(),
        type: action.payload.type,
        src: action.payload.src,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        startTime: 0,
        endTime: 10,
        ...action.payload,
      });
    },
    updateMediaItem: (state, action) => {
      const index = state.mediaItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.mediaItems[index] = {
          ...state.mediaItems[index],
          ...action.payload,
        };
      }
    },
    selectItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

// Export all action creators
export const {
  addMediaItem,
  updateMediaItem,
  selectItem,
  setCurrentTime,
  togglePlay,
} = editorSlice.actions;

export default editorSlice.reducer;
