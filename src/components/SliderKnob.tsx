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
    const onMouseDown = (e: MouseEvent) => {
      if (e.target !== ref.current) {
        return false;
      }
      refIsDragging.current = true;
      onDragStart(e.clientX);
      return true;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!refIsDragging.current) {
        return false;
      }
      onDrag(e.clientX);
      return true;
    };
    const onMouseUp = () => {
      if (!refIsDragging.current) {
        return false;
      }
      refIsDragging.current = false;
      onDragEnd();
      return true;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onDragStart, onDrag, onDragEnd]);
  return (
    <div
      ref={ref}
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
