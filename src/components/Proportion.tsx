import { DynamicChildPositioner } from "./DynamicChildPositioner";
import { HiddenSpaceTaker } from "./HiddenSpaceTaker";
import { ProportionDetail, DisplayValueTypes } from "./ProportionSlider";

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
  const nameNode = (
    <div
      style={{
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {detail.name}
    </div>
  );
  const percentNode =
    displayValueType === "percentage" ? (
      <div
        style={{
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {`${Math.round((value * 100) / total)}%`}
      </div>
    ) : null;

  const maxPercentNode =
    displayValueType === "percentage" ? (
      <div
        style={{
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {`100%`}
      </div>
    ) : null;

  return (
    <DynamicChildPositioner
      width={width}
      rightNode={anchorName === "right" ? nameNode : percentNode}
      leftNode={anchorName === "left" ? nameNode : percentNode}
      options={{
        primary: anchorName,
      }}
      backgroundColor={backgroundColor}
    >
      <HiddenSpaceTaker>{maxPercentNode}</HiddenSpaceTaker>
      <HiddenSpaceTaker>{nameNode}</HiddenSpaceTaker>
    </DynamicChildPositioner>
  );
};
