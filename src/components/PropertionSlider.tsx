import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

// AnimatableTextContainer animates text outside of component if
// its longer than the container. It uses CSS animations to move.
// There will be two text in each. One in the left and one in the right.
// If the width is not enough to show the text, it will animate the text
// to show the full text. It will move the text outside of boundary of container

const GAP = 5;
const STYLES = {
  TOP_LEFT: {
    left: GAP,
    top: -GAP,
    transform: "translateY(-100%)",
  },
  LEFT: {
    left: GAP,
    top: "50%",
    transform: "translateY(-50%)",
  },
  BOTTOM_LEFT: {
    left: GAP,
    bottom: -GAP,
    transform: "translateY(100%)",
  },
  TOP_RIGHT: {
    right: GAP,
    top: -GAP,
    transform: "translateY(-100%)",
  },
  RIGHT: {
    right: GAP,
    top: "50%",
    transform: "translateY(-50%)",
  },
  BOTTOM_RIGHT: {
    right: GAP,
    bottom: -GAP,
    transform: "translateY(100%)",
  },
};

type DynamicChildPositionerProps = {
  rightNode: React.ReactNode;
  leftNode: React.ReactNode;
  options: {
    primary: "left" | "right";
  };
  backgroundColor?: string;
  width: number | string;
};
const DynamicChildPositioner = ({
  rightNode,
  leftNode,
  options: { primary },
  width,
  backgroundColor = "gray",
}: DynamicChildPositionerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLDivElement | null>(null);
  const refLeft = useRef<HTMLDivElement | null>(null);
  const [fitStatus, setFitStatus] = useState<"both" | "primary" | "none">(
    "both"
  );

  const rightStyle = useMemo(() => {
    const rightNoSpace =
      fitStatus === "none" || (fitStatus === "primary" && primary === "left");
    if (primary === "right") {
      return rightNoSpace ? STYLES["BOTTOM_RIGHT"] : STYLES["RIGHT"];
    } else {
      return rightNoSpace ? STYLES["TOP_LEFT"] : STYLES["RIGHT"];
    }
  }, [fitStatus, primary]);

  const leftStyle = useMemo(() => {
    const leftNoSpace =
      fitStatus === "none" || (fitStatus === "primary" && primary === "right");
    if (primary === "left") {
      return leftNoSpace ? STYLES["BOTTOM_LEFT"] : STYLES["LEFT"];
    } else {
      return leftNoSpace ? STYLES["TOP_RIGHT"] : STYLES["LEFT"];
    }
  }, [fitStatus, primary]);

  useEffect(() => {
    const interval = setInterval(() => {
      const textRight = refRight.current;
      const textLeft = refLeft.current;
      const container = ref.current;
      if (!container || !textRight || !textLeft) {
        return;
      }
      const containerRectWidth = container.getBoundingClientRect().width;
      const rightWidth = textRight.getBoundingClientRect().width;
      const leftWidth = textLeft.getBoundingClientRect().width;

      const secondaryWidth = primary === "left" ? leftWidth : rightWidth;
      const primaryWidth = primary === "left" ? rightWidth : leftWidth;

      const primaryCanFit = primaryWidth + 2 * GAP <= containerRectWidth;
      const secondaryCanFit =
        secondaryWidth + primaryWidth + 3 * GAP <= containerRectWidth;

      const fitStatus = primaryCanFit
        ? secondaryCanFit
          ? "both"
          : "primary"
        : "none";

      setFitStatus(fitStatus);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [ref, refRight, refLeft, primary]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width,
        backgroundColor,
        borderRadius: "5px",
        color: "white",
      }}
    >
      <div
        ref={refLeft}
        style={{
          position: "absolute",
          transition:
            "transform 0.25s cubic-bezier(.47,1.64,.41,.8), top 0.25s cubic-bezier(.47,1.64,.41,.8)",
          ...leftStyle,
        }}
      >
        {leftNode}
      </div>
      <div
        ref={refRight}
        style={{
          position: "absolute",
          transition:
            "transform 0.25s cubic-bezier(.47,1.64,.41,.8), top 0.25s cubic-bezier(.47,1.64,.41,.8)",
          ...rightStyle,
        }}
      >
        {rightNode}
      </div>
    </div>
  );
};
