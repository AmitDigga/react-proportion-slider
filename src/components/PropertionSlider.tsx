import { useCallback, useEffect, useRef } from "react";

export type ProportionDetail = {
  name: string;
};

type DisplayValueTypes = "percentage" | "none";
export type ProportionSliderProps = {
  value: [number, number];
  proportions: [ProportionDetail, ProportionDetail];
  onChange: (change: [number, number]) => void;
  sliderOptions?: {
    width: number;
    gap: number;
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
      const newValue1 =
        refValue1Start.current! + (diffPx / totalWidthPx) * total;
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
        total={total}
        width={`calc(${(value[0] * 100) / total}% - ${sliderWidth / 2}px)`}
        detail={proportions[0]}
        anchorName="left"
        displayValueType={options.displayValueType}
      />
      <SliderKnob
        width={sliderOptions.width}
        gap={sliderOptions.gap}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
      <Proportion
        value={value[1]}
        total={total}
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
};
export const Proportion = ({
  value,
  total,
  detail,
  width,
  anchorName,
  displayValueType,
}: ProportionProp) => {
  const percent = (value * 100) / total;
  const percentFormatted = `${percent.toFixed(2)}%`;
  return (
    <div
      style={{
        width,
        background: "gray",
        alignSelf: "stretch",
        borderRadius: "5px",
        color: "white",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          marginLeft: anchorName === "left" ? "5px" : "auto",
          marginRight: anchorName === "right" ? "5px" : "auto",
          alignSelf: "center",
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
  onDragStart: (px: number) => void;
  onDrag: (px: number) => void;
  onDragEnd: () => void;
};

export const SliderKnob = ({
  width,
  gap,
  onDrag,
  onDragStart,
  onDragEnd,
}: SliderKnobProps) => {
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      onDragStart(e.clientX);
    };
    const onMouseMove = (e: MouseEvent) => {
      onDrag(e.clientX);
    };
    const onMouseUp = () => {
      onDragEnd();
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
      style={{
        width: `${width}px`,
        margin: `${gap}px ${gap}px`,
        alignSelf: "stretch",
        background: "red",
        borderRadius: "2px",
      }}
    ></div>
  );
};
