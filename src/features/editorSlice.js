import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mediaItems: [],
  selectedItem: null,
  isPlaying: false,
  currentTime: 0,
  duration: 10,
  playbackRate: 1,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addMediaItem: (state, action) => {
      const newItem = {
        id: Date.now(),
        type: action.payload.type,
        src: action.payload.src,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        startTime: 0,
        endTime: action.payload.duration || 10,
        duration: action.payload.duration || 10,
        name: action.payload.name || "Untitled",
      };
      state.mediaItems.push(newItem);
      state.duration = Math.max(state.duration, newItem.endTime);
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
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
      if (state.currentTime >= state.duration) {
        state.isPlaying = false;
      }
    },
    removeMediaItem: (state, action) => {
      // Remove the item with the given ID
      state.mediaItems = state.mediaItems.filter(
        (item) => item.id !== action.payload
      );

      // Deselect if the deleted item was selected
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null;
      }
    },
    seekTime: (state, action) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
    },
    setDuration: (state, action) => {
      state.duration = Math.max(1, action.payload);
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = Math.max(0.1, Math.min(action.payload, 4));
    },
  },
});

export const {
  addMediaItem,
  updateMediaItem,
  selectItem,
  togglePlay,
  setCurrentTime,
  seekTime,
  setDuration,
  setPlaybackRate,
  removeMediaItem,
} = editorSlice.actions;

export default editorSlice.reducer;
