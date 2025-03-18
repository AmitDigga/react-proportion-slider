import { useCallback, useRef, CSSProperties, useEffect } from "react";
import {
  DynamicChildPositioner,
  SliderKnob,
  ProportionDetail,
  SliderKnobOptions,
} from "./components";
import { EventType, getClientX, clamp } from "./utilities";

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
  /** Width of the slider in pixels */
  width?: number;
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
  width,
}: ProportionSliderProps) => {
  const mergedKnobOptions = getMergeKnobOptions(knobOptions);

  const ref = useRef<HTMLDivElement | null>(null);
  const total = value[0] + value[1];
  const sliderWidth = mergedKnobOptions.width + mergedKnobOptions.gap * 2;
  const refTotal = useRef<number>(total);
  const refSliderWidth = useRef<number>(sliderWidth);
  refTotal.current = total;
  refSliderWidth.current = sliderWidth;
  const refIsDragging = useRef<boolean>(false);

  const onChangeValueFromEvent = useCallback(
    (e: EventType, { width, left }: { width: number; left: number }) => {
      const x = getClientX(e);
      const knobWidth = refSliderWidth.current;
      const factor = (x - left - knobWidth / 2) / (width - knobWidth);
      const total = refTotal.current;
      const value1 = clamp(total * factor, 0, total);
      onChange?.([value1, total - value1]);
    },
    [onChange]
  );

  const onDown = useCallback(
    (e: EventType) => {
      const target = e.target as HTMLElement;
      const rect = ref.current?.getBoundingClientRect();
      if (
        (ref.current && !ref.current.contains(target)) ||
        !rect ||
        rect.width === 0
      ) {
        console.log("returning because of rect width", rect?.width);
        return;
      }
      e.preventDefault();
      refIsDragging.current = true;
      onChangeValueFromEvent(e, rect);
      return true;
    },
    [onChangeValueFromEvent]
  );

  const onMove = useCallback(
    (e: EventType) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!refIsDragging.current || !rect || rect.width === 0) {
        return false;
      }
      e.preventDefault();
      onChangeValueFromEvent(e, rect);
      return true;
    },
    [onChangeValueFromEvent]
  );

  const onUp = useCallback((e: EventType) => {
    if (!refIsDragging.current) return false;
    refIsDragging.current = false;
    e.preventDefault();
    return true;
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onDown);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [onDown, onMove, onUp]);
  return (
    <div
      ref={ref}
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round((value[0] / total) * 100)}
      style={{
        display: "flex",
        flexDirection: "row",
        height,
        width,
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
      <SliderKnob disabled={disabled} {...mergedKnobOptions} />
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
