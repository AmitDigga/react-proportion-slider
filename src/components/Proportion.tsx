import { DynamicChildPositioner } from "./DynamicChildPositioner";
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

  return (
    <DynamicChildPositioner
      width={width}
      rightNode={anchorName === "right" ? nameNode : percentNode}
      leftNode={anchorName === "left" ? nameNode : percentNode}
      options={{
        primary: anchorName,
      }}
      backgroundColor={backgroundColor}
    ></DynamicChildPositioner>
  );
};
