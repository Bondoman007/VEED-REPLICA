import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMediaItem,
  removeMediaItem,
  selectItem,
} from "../../features/editorSlice";
import useDrag from "./hooks/useDrag";
import useResize from "./hooks/useResize";

const CanvasItem = React.memo(({ item, isVisible, currentTime }) => {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const { isPlaying, playbackRate } = useSelector((state) => state.editor);
  const selectedItem = useSelector((state) => state.editor.selectedItem);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Handle video ready state
  useEffect(() => {
    if (item.type !== "video" || !videoRef.current) return;

    const video = videoRef.current;
    const handleCanPlay = () => setIsVideoReady(true);
    const handleError = () => setIsVideoReady(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [item.type]);

  // Handle video playback
  const handleVideoPlayback = useCallback(async () => {
    if (item.type !== "video" || !videoRef.current || !isVideoReady) return;

    const video = videoRef.current;
    const targetTime = currentTime - item.startTime;

    try {
      if (Math.abs(video.currentTime - targetTime) > 0.1) {
        video.currentTime = targetTime;
      }
      video.playbackRate = playbackRate;

      if (
        isPlaying &&
        isVisible &&
        targetTime >= 0 &&
        targetTime <= item.duration
      ) {
        if (video.paused) {
          await video.play();
        }
      } else if (!video.paused) {
        video.pause();
      }
    } catch (error) {
      console.log("Playback error handled:", error.name);
      video.pause();
    }
  }, [currentTime, isPlaying, isVisible, item, playbackRate, isVideoReady]);

  useEffect(() => {
    handleVideoPlayback();
    let rafId;
    if (isVisible && item.type === "video") {
      const update = () => {
        handleVideoPlayback();
        rafId = requestAnimationFrame(update);
      };
      rafId = requestAnimationFrame(update);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleVideoPlayback, isVisible, item.type]);

  // Handle drag
  const handleDrag = useCallback(
    (pos) => {
      dispatch(updateMediaItem({ id: item.id, x: pos.x, y: pos.y }));
    },
    [dispatch, item.id]
  );

  // Handle resize
  const handleResizeEnd = useCallback(
    (size) => {
      dispatch(
        updateMediaItem({ id: item.id, width: size.width, height: size.height })
      );
    },
    [dispatch, item.id]
  );

  // Remove item from canvas
  const handleDelete = () => {
    dispatch(removeMediaItem(item.id));
  };

  useDrag(ref, { x: item.x, y: item.y }, handleDrag);
  useResize(ref, handleResizeEnd);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        border:
          selectedItem?.id === item.id
            ? "2px solid #228be6"
            : "2px dashed #ddd",
        cursor: "grab",
        overflow: "hidden",
        userSelect: "none",
        zIndex: selectedItem?.id === item.id ? 10 : 1,
        display: isVisible ? "block" : "none",
        willChange: "transform",
      }}
      onClick={() => dispatch(selectItem(item))}
    >
      {item.type === "image" ? (
        <img
          src={item.src}
          alt="media"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
          playsInline
          preload="auto"
        />
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          position: "fixed",
          top: "-2px",
          right: "-2px",
          background: "rgba(30, 28, 28, 0.7)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>

      {selectedItem?.id === item.id && (
        <div
          className="resize-handle"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "16px",
            height: "16px",
            backgroundColor: "#228be6",
            cursor: "se-resize",
          }}
        />
      )}
    </div>
  );
});

export default CanvasItem;
