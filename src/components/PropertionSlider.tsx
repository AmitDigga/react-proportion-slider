import { useCallback, useEffect, useRef } from "react";

export type ProportionDetail = {
  name: string;
  backgroundColor?: string;
};

type DisplayValueTypes = "percentage" | "none";
export type ProportionSliderProps = {
  value: [number, number];
  proportions: [ProportionDetail, ProportionDetail];
  onChange: (change: [number, number]) => void;
  sliderOptions?: {
    width: number;
    gap: number;
    backgroundColor?: string;
  };
  options?: {
    height: number;
    displayValueType: DisplayValueTypes;
  };
};
export const ProportionSlider = ({
  value,
  proportions,
  onChange,
  sliderOptions = {
    width: 5,
    gap: 2,
  },
  options = {
    height: 20,
    displayValueType: "percentage",
  },
}: ProportionSliderProps) => {
  const refWidth = useRef<number | null>(null);

  const total = value[0] + value[1];

  const refStartX = useRef<number | null>(null);
  const refValue1Start = useRef<number | null>(null);
  const refValue2Start = useRef<number | null>(null);
  const sliderWidth = sliderOptions.width + sliderOptions.gap * 2;
  const onDragStart = useCallback(
    (px: number): void => {
      refStartX.current = px;
      refValue1Start.current = value[0];
      refValue2Start.current = value[1];
    },
    [value]
  );
  const onDragEnd = useCallback(() => {
    refStartX.current = null;
    refValue1Start.current = null;
    refValue2Start.current = null;
  }, []);
  const onDrag = useCallback(
    (px: number): void => {
      if (refStartX.current === null) return;
      const diffPx = px - refStartX.current;
      const totalWidthPx = refWidth.current! - sliderWidth;
      const total = refValue1Start.current! + refValue2Start.current!;
      let newValue1 = refValue1Start.current! + (diffPx / totalWidthPx) * total;
      newValue1 = Math.max(0, Math.min(total, newValue1));
      onChange([newValue1, total - newValue1]);
    },
    [onChange, sliderWidth]
  );
  return (
    <div
      ref={(el) => {
        if (el) {
          refWidth.current = el.getBoundingClientRect().width;
        }
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        height: options.height,
      }}
    >
      <Proportion
        value={value[0]}
        backgroundColor={proportions[0].backgroundColor}
        total={total}
        width={`calc(${(value[0] * 100) / total}% - ${sliderWidth / 2}px)`}
        detail={proportions[0]}
        anchorName="left"
        displayValueType={options.displayValueType}
      />
      <SliderKnob
        backgroundColor={sliderOptions.backgroundColor}
        width={sliderOptions.width}
        gap={sliderOptions.gap}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
      <Proportion
        value={value[1]}
        total={total}
        backgroundColor={proportions[1].backgroundColor}
        width={`calc(${(value[1] * 100) / total}% - ${sliderWidth / 2}px)`}
        detail={proportions[1]}
        anchorName="right"
        displayValueType={options.displayValueType}
      />
    </div>
  );
};

export type ProportionProp = {
  value: number;
  total: number;
  detail: ProportionDetail;
  width: number | string;
  anchorName: "left" | "right";
  displayValueType: DisplayValueTypes;
  backgroundColor?: string;
};
export const Proportion = ({
  value,
  total,
  detail,
  width,
  anchorName,
  displayValueType,
  backgroundColor = "gray",
}: ProportionProp) => {
  const percent = (value * 100) / total;
  const percentFormatted = `${Math.round(percent)}%`;
  return (
    <div
      style={{
        width,
        background: backgroundColor,
        alignSelf: "stretch",
        borderRadius: "5px",
        color: "white",
        display: "flex",
        flexDirection: anchorName === "left" ? "row" : "row-reverse",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginLeft: anchorName === "left" ? "5px" : "auto",
          marginRight: anchorName === "right" ? "5px" : "auto",
        }}
      >
        {detail.name}
      </div>
      {displayValueType === "percentage" ? <div>{percentFormatted}</div> : null}
    </div>
  );
};

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
