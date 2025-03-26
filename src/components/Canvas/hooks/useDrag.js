// src/components/Canvas/hooks/useDrag.js
import { useEffect, useCallback } from "react";

const useDrag = (ref, position, onDrag) => {
  const handleMouseMove = useCallback(
    (e, startX, startY, initialX, initialY) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Update position directly for smooth dragging
      ref.current.style.left = `${initialX + dx}px`;
      ref.current.style.top = `${initialY + dy}px`;
    },
    [ref]
  );

  const handleMouseUp = useCallback(
    (mouseMoveHandler, mouseUpHandler, initialX, initialY, dx, dy) => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      ref.current.style.cursor = "grab";

      // Final position update after drag ends
      onDrag({
        x: initialX + dx,
        y: initialY + dy,
      });
    },
    [ref, onDrag]
  );

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let startX,
      startY,
      initialX,
      initialY,
      dx = 0,
      dy = 0;

    const onMouseDown = (e) => {
      // Ignore resize handle clicks
      if (e.target.classList.contains("resize-handle")) return;

      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      initialX = position.x;
      initialY = position.y;

      const mouseMoveHandler = (e) => {
        dx = e.clientX - startX;
        dy = e.clientY - startY;
        handleMouseMove(e, startX, startY, initialX, initialY);
      };

      const mouseUpHandler = () => {
        handleMouseUp(
          mouseMoveHandler,
          mouseUpHandler,
          initialX,
          initialY,
          dx,
          dy
        );
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
      element.style.cursor = "grabbing";
    };

    element.addEventListener("mousedown", onMouseDown);
    element.style.cursor = "grab";

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      element.style.cursor = "";
    };
  }, [ref, position, handleMouseMove, handleMouseUp]);
};

export default useDrag;
