import { useState } from "react";

export type ProportionDetail = {
  name: string;
};

export type ProportionSliderProps = {
  value: [number, number];
  proportions: [ProportionDetail, ProportionDetail];
  onChange: (change: [number, number]) => void;
};
export const ProportionSlider = ({
  value,
  proportions,
  onChange,
}: ProportionSliderProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Proportion detail={proportions[0]} />
      <SliderKnob />
      <Proportion detail={proportions[1]} />
    </div>
  );
};

export type ProportionProp = {
  detail: ProportionDetail;
};
export const Proportion = ({ detail }: ProportionProp) => {
  return <div>{detail.name}</div>;
};

export const SliderKnob = () => {
  return <div>Knob</div>;
};
