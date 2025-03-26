// src/components/Canvas/hooks/useResize.js
import { useEffect } from "react";

const useResize = (ref, onResizeEnd) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let startX, startY, startWidth, startHeight;

    const handleMouseDown = (e) => {
      // Only handle resize if clicking on the resize handle
      if (!e.target.classList.contains("resize-handle")) return;

      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(element).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(element).height,
        10
      );

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newWidth = Math.max(50, startWidth + dx);
      const newHeight = Math.max(50, startHeight + dy);

      // Update element dimensions directly for smooth resizing
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Final update after resize ends
      if (onResizeEnd) {
        const rect = element.getBoundingClientRect();
        onResizeEnd({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    element.addEventListener("mousedown", handleMouseDown);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref, onResizeEnd]);
};

export default useResize;
