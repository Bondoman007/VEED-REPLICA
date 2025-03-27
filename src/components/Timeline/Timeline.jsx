// components/Timeline/Timeline.jsx
import React, { useRef, useEffect } from "react";
import { Slider } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { seekTime, togglePlay } from "../../features/editorSlice";

const Timeline = () => {
  const dispatch = useDispatch();
  const { currentTime, duration, isPlaying } = useSelector(
    (state) => state.editor
  );
  const timelineRef = useRef(null);

  const handleSeek = (value) => {
    dispatch(seekTime(value));
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "white",
        borderTop: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => dispatch(togglePlay())}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span>{currentTime.toFixed(2)}s</span>
        <Slider
          ref={timelineRef}
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration}
          step={0.01}
          style={{ flex: 1 }}
          label={(value) => `${value.toFixed(2)}s`}
        />
        <span>{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default Timeline;
