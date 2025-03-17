import { useRef, useEffect, CSSProperties } from "react";
import { getClientX } from "../utilities";

export type SliderKnobProps = {
  className?: string;
  width: number;
  gap: number;
  backgroundColor?: string;
  onDragStart?: (px: number) => void;
  onDrag?: (px: number) => void;
  onDragEnd?: () => void;
  style?: CSSProperties;
};

export const SliderKnob = ({
  className,
  width,
  gap,
  backgroundColor = "red",
  onDrag,
  onDragStart,
  onDragEnd,
  style,
}: SliderKnobProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const refIsDragging = useRef<boolean>(false);
  useEffect(() => {
    if (ref.current === null) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (!onDragStart) return false;
      if ("touches" in e) {
        if (!ref.current?.contains(e.target as Node)) {
          return false;
        }
      } else if (e.target !== ref.current) {
        return false;
      }

      e.preventDefault();
      refIsDragging.current = true;
      onDragStart(getClientX(e));
      return true;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!refIsDragging.current) {
        return false;
      }
      e.preventDefault();
      onDrag?.(getClientX(e));
      return true;
    };

    const handleEnd = () => {
      if (!refIsDragging.current) {
        return false;
      }
      refIsDragging.current = false;
      onDragEnd?.();
      return true;
    };

    // Mouse events
    const target = ref.current;
    target.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    // Touch events
    window.addEventListener("touchstart", handleStart);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      // Remove mouse events
      target.removeEventListener("mousedown", handleStart);
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
      className={className}
      style={{
        alignSelf: "stretch",
        borderRadius: "2px",
        cursor: "ew-resize",
        ...style,
        width: `${width}px`,
        margin: `${gap}px ${gap}px`,
        background: backgroundColor,
      }}
    ></div>
  );
};
