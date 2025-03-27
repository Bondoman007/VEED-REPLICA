import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mantine/core";
import { setCurrentTime, togglePlay } from "../../features/editorSlice";
import CanvasItem from "./CanvasItem";

const Canvas = () => {
  const canvasRef = useRef(null);
  const mediaItems = useSelector((state) => state.editor.mediaItems);
  const { currentTime, isPlaying, duration } = useSelector(
    (state) => state.editor
  );
  const dispatch = useDispatch();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let animationFrame;
    let lastTimestamp = 0;
    let accumulatedTime = 0;

    const updateTime = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        accumulatedTime += delta;

        // Update at 60fps for smooth playback
        if (accumulatedTime >= 1 / 60) {
          const newTime = currentTime + accumulatedTime;
          dispatch(setCurrentTime(Math.min(newTime, duration)));
          accumulatedTime = 0;

          if (newTime >= duration) {
            dispatch(togglePlay());
          }
        }
      }

      animationFrame = requestAnimationFrame(updateTime);
    };

    animationFrame = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, currentTime, duration, dispatch]);

  return (
    <Box
      ref={canvasRef}
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        overflow: "hidden",
      }}
    >
      {mediaItems.map((item) => {
        const isVisible =
          currentTime >= item.startTime && currentTime <= item.endTime;
        return (
          <CanvasItem
            key={item.id}
            item={item}
            isVisible={isVisible}
            currentTime={currentTime}
          />
        );
      })}
    </Box>
  );
};

export default Canvas;
