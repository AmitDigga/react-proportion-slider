import { useCallback, useEffect, useRef } from "react";

export type ProportionDetail = {
  name: string;
};

export type ProportionSliderProps = {
  value: [number, number];
  proportions: [ProportionDetail, ProportionDetail];
  onChange: (change: [number, number]) => void;
  sliderOptions?: {
    width: number;
    gap: number;
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
      }}
    >
      <Proportion
        width={`calc(${(value[0] * 100) / total}% - ${sliderWidth / 2}px)`}
        detail={proportions[0]}
      />
      <SliderKnob
        width={sliderOptions.width}
        gap={sliderOptions.gap}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
      <Proportion
        width={`calc(${(value[1] * 100) / total}% - ${sliderWidth / 2}px)`}
        detail={proportions[1]}
      />
    </div>
  );
};

export type ProportionProp = {
  detail: ProportionDetail;
  width: number | string;
};
export const Proportion = ({ detail, width }: ProportionProp) => {
  return (
    <div
      style={{
        width,
        background: "gray",
        alignSelf: "stretch",
      }}
    >
      {detail.name}
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
        margin: `0 ${gap}px`,
        alignSelf: "stretch",
        background: "red",
      }}
    ></div>
  );
};
