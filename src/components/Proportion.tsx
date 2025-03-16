import { DynamicChildPositioner } from "./DynamicChildPositioner";
import { HiddenSpaceTaker } from "./HiddenSpaceTaker";
import { ProportionDetail } from "./types";

export type ProportionProp = {
  valueLabel: string;
  detail: ProportionDetail;
  width: number | string;
  anchor: "left" | "right";
};
export const Proportion = ({
  valueLabel,
  detail,
  width,
  anchor,
}: ProportionProp) => {
  const labelNode = <div style={TEXT_STYLE}>{detail.label}</div>;
  const percentNode = <div style={TEXT_STYLE}>{valueLabel}</div>;
  const maxPercentNode = <div style={TEXT_STYLE}>{`100%`}</div>;

  return (
    <DynamicChildPositioner
      ariaLabel={detail.ariaLabel}
      width={width}
      rightNode={anchor === "right" ? labelNode : percentNode}
      leftNode={anchor === "left" ? labelNode : percentNode}
      primaryNode={anchor}
      backgroundColor={detail.backgroundColor}
    >
      <HiddenSpaceTaker>{maxPercentNode}</HiddenSpaceTaker>
      <HiddenSpaceTaker>{labelNode}</HiddenSpaceTaker>
    </DynamicChildPositioner>
  );
};

const TEXT_STYLE = {
  whiteSpace: "nowrap",
  userSelect: "none",
} as const;
