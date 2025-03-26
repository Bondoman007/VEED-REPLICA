import React, { useRef, useCallback } from "react";
import useDrag from "./hooks/useDrag";
import useResize from "./hooks/useResize";
import { useSelector, useDispatch } from "react-redux";
import { updateMediaItem, selectItem } from "../../features/editorSlice";

const CanvasItem = React.memo(({ item }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.editor.selectedItem);

  const handleDrag = useCallback(
    (pos) => {
      dispatch(
        updateMediaItem({
          id: item.id,
          x: pos.x,
          y: pos.y,
        })
      );
    },
    [dispatch, item.id]
  );

  const handleResizeEnd = useCallback(
    (size) => {
      dispatch(
        updateMediaItem({
          id: item.id,
          width: size.width,
          height: size.height,
        })
      );
    },
    [dispatch, item.id]
  );

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
        willChange: "transform",
        touchAction: "none",
      }}
      onClick={() => dispatch(selectItem(item))}
    >
      {item.type === "image" ? (
        <img
          src={item.src}
          alt="media"
          draggable="false"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userDrag: "none",
          }}
        />
      ) : (
        <video
          src={item.src}
          draggable="false"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userDrag: "none",
          }}
          controls={false}
          muted
        />
      )}
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
