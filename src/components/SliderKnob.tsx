import { CSSProperties } from "react";

export type SliderKnobProps = {
  className?: string;
  width: number;
  gap: number;
  backgroundColor?: string;
  style?: CSSProperties;
  disabled?: boolean;
};

export const SliderKnob = ({
  className,
  width,
  gap,
  backgroundColor = "red",
  style,
  disabled,
}: SliderKnobProps) => {
  return (
    <div
      role="button"
      className={className}
      style={{
        alignSelf: "stretch",
        borderRadius: "2px",
        cursor: disabled ? "not-allowed" : "ew-resize",
        ...style,
        width: `${width}px`,
        margin: `${gap}px ${gap}px`,
        background: backgroundColor,
      }}
    ></div>
  );
};
