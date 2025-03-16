import { useCallback, useRef, CSSProperties } from "react";
import { DynamicChildPositioner, SliderKnob } from "./components";
import { ProportionDetail, SliderKnobOptions } from "./components/types";

export type ProportionSliderProps = {
  /**
   * Current values of the two proportions [left, right]
   * These should be positive numbers
   */
  value: [number, number];

  /**
   * Details for the two proportions [left, right]
   */
  proportions: [ProportionDetail, ProportionDetail];

  /**
   * Callback when values change
   * @param values The new values [left, right]
   */
  onChange?: (values: [number, number]) => void;

  /**
   * Appearance of the slider knob
   */
  knobOptions?: SliderKnobOptions;

  /** Height of the slider in pixels */
  height?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Custom class name for the slider container */
  className?: string;
  /** Custom styles for the slider container */
  style?: CSSProperties;

  /**
   * Accessibility options
   */
  ariaLabel?: string;
};

export const ProportionSlider = ({
  value,
  proportions,
  onChange,
  knobOptions,
  disabled,
  height,
  ariaLabel,
  className,
  style,
}: ProportionSliderProps) => {
  const mergedKnobOptions = getMergeKnobOptions(knobOptions);

  const refWidth = useRef<number | null>(null);
  const total = value[0] + value[1];

  const refStartX = useRef<number | null>(null);
  const refValue1Start = useRef<number | null>(null);
  const refValue2Start = useRef<number | null>(null);
  const sliderWidth = mergedKnobOptions.width + mergedKnobOptions.gap * 2;
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
      onChange?.([newValue1, total - newValue1]);
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
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round((value[0] / total) * 100)}
      style={{
        display: "flex",
        flexDirection: "row",
        height,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      className={className}
    >
      <DynamicChildPositioner
        detail={proportions[0]}
        valueLabel={`${Math.round((value[0] * 100) / total)}%`}
        width={`calc(${(value[0] * 100) / total}% - ${sliderWidth / 2}px)`}
        primaryNode="left"
      />
      <SliderKnob
        onDragStart={disabled ? undefined : onDragStart}
        onDrag={disabled ? undefined : onDrag}
        onDragEnd={disabled ? undefined : onDragEnd}
        {...mergedKnobOptions}
      />
      <DynamicChildPositioner
        detail={proportions[1]}
        valueLabel={`${Math.round((value[1] * 100) / total)}%`}
        width={`calc(${(value[1] * 100) / total}% - ${sliderWidth / 2}px)`}
        primaryNode="right"
      />
    </div>
  );
};

const DefaultKnobOptions: Required<SliderKnobOptions> = {
  width: 5,
  gap: 2,
  backgroundColor: "red",
  className: "slider-knob",
  style: {},
};

function getMergeKnobOptions(
  knobOptions: SliderKnobOptions | undefined = {}
): Required<SliderKnobOptions> {
  return {
    width: knobOptions.width ?? DefaultKnobOptions.width,
    gap: knobOptions.gap ?? DefaultKnobOptions.gap,
    backgroundColor:
      knobOptions.backgroundColor ?? DefaultKnobOptions.backgroundColor,
    className: knobOptions.className ?? DefaultKnobOptions.className,
    style: knobOptions.style ?? DefaultKnobOptions.style,
  };
}
