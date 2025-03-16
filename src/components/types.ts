import { CSSProperties } from "react";

export type SliderKnobOptions = {
  /** Width of the slider knob in pixels */
  width?: number;
  /** Gap around the slider knob in pixels */
  gap?: number;
  /** Color of the slider knob */
  backgroundColor?: string;
  /** Custom class name for the knob */
  className?: string;
  /** Custom styles for the knob */
  style?: CSSProperties;
};

export type ProportionDetail = {
  /** Custom label to display instead of percentage or value */
  label: string;
  /** Color of the proportion segment */
  backgroundColor?: string;
  /** Optional data to associate with this proportion */
  data?: unknown;
  ariaLabel?: string;
};
