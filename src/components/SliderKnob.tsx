import { useRef, useEffect } from "react";

export type SliderKnobProps = {
  width: number;
  gap: number;
  backgroundColor?: string;
  onDragStart: (px: number) => void;
  onDrag: (px: number) => void;
  onDragEnd: () => void;
};

export const SliderKnob = ({
  width,
  gap,
  backgroundColor = "red",
  onDrag,
  onDragStart,
  onDragEnd,
}: SliderKnobProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const refIsDragging = useRef<boolean>(false);
  useEffect(() => {
    const getClientX = (e: MouseEvent | TouchEvent): number => {
      return isTouchEvent(e) ? e.touches[0].clientX : (e as MouseEvent).clientX;
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        if (!ref.current?.contains(e.target as Node)) {
          return false;
        }
      } else if (e.target !== ref.current) {
        return false;
      }

      refIsDragging.current = true;
      onDragStart(getClientX(e));
      return true;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!refIsDragging.current) {
        return false;
      }
      onDrag(getClientX(e));
      return true;
    };

    const handleEnd = () => {
      if (!refIsDragging.current) {
        return false;
      }
      refIsDragging.current = false;
      onDragEnd();
      return true;
    };

    // Mouse events
    window.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    // Touch events
    window.addEventListener("touchstart", handleStart, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      // Remove mouse events
      window.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);

      // Remove touch events
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [onDragStart, onDrag, onDragEnd]);

  return (
    <div
      ref={ref}
      role="button"
      style={{
        width: `${width}px`,
        margin: `${gap}px ${gap}px`,
        alignSelf: "stretch",
        background: backgroundColor,
        borderRadius: "2px",
        cursor: "ew-resize",
      }}
    ></div>
  );
};

function isTouchEvent(e: MouseEvent | TouchEvent): e is TouchEvent {
  return "touches" in e;
}
