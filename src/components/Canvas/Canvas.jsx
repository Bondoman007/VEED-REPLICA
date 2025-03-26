// components/Canvas/Canvas.jsx
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mantine/core";
import { setCurrentTime } from "../../features/editorSlice";
import CanvasItem from "./CanvasItem";

const Canvas = () => {
  const canvasRef = useRef(null);
  const mediaItems = useSelector((state) => state.editor.mediaItems);
  const currentTime = useSelector((state) => state.editor.currentTime);
  const isPlaying = useSelector((state) => state.editor.isPlaying);
  const dispatch = useDispatch();

  useEffect(() => {
    let animationFrame;
    let lastTime = 0;

    const updateTime = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000;

      if (isPlaying) {
        dispatch(setCurrentTime(currentTime + delta));
      }

      lastTime = timestamp;
      animationFrame = requestAnimationFrame(updateTime);
    };

    animationFrame = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, currentTime, dispatch]);

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
        return isVisible ? <CanvasItem key={item.id} item={item} /> : null;
      })}
    </Box>
  );
};

export default Canvas;
