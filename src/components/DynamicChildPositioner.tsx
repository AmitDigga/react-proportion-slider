import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  PropsWithChildren,
} from "react";

type DynamicChildPositionerProps = PropsWithChildren<{
  rightNode: React.ReactNode;
  leftNode: React.ReactNode;
  primaryNode: "left" | "right";
  backgroundColor?: string;
  width: number | string;
  ariaLabel?: string;
}>;

export const DynamicChildPositioner = ({
  rightNode,
  leftNode,
  primaryNode,
  width,
  backgroundColor = "gray",
  children,
  ariaLabel,
}: DynamicChildPositionerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLDivElement | null>(null);
  const refLeft = useRef<HTMLDivElement | null>(null);
  const [fitStatus, setFitStatus] = useState<"both" | "primary" | "none">(
    "both"
  );

  const rightStyle = useMemo(() => {
    const rightNoSpace =
      fitStatus === "none" ||
      (fitStatus === "primary" && primaryNode === "left");
    if (primaryNode === "right") {
      return rightNoSpace ? STYLES["BOTTOM_RIGHT"] : STYLES["RIGHT"];
    } else {
      return rightNoSpace ? STYLES["TOP_LEFT"] : STYLES["RIGHT"];
    }
  }, [fitStatus, primaryNode]);

  const leftStyle = useMemo(() => {
    const leftNoSpace =
      fitStatus === "none" ||
      (fitStatus === "primary" && primaryNode === "right");
    if (primaryNode === "left") {
      return leftNoSpace ? STYLES["BOTTOM_LEFT"] : STYLES["LEFT"];
    } else {
      return leftNoSpace ? STYLES["TOP_RIGHT"] : STYLES["LEFT"];
    }
  }, [fitStatus, primaryNode]);

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

      const { primaryWidth, secondaryWidth } =
        primaryNode === "left"
          ? { primaryWidth: leftWidth, secondaryWidth: rightWidth }
          : { primaryWidth: rightWidth, secondaryWidth: leftWidth };

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
  }, [ref, refRight, refLeft, primaryNode]);

  return (
    <div
      ref={ref}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width,
        backgroundColor,
        borderRadius: "5px",
        color: "white",
      }}
    >
      <div ref={refLeft} style={leftStyle}>
        {leftNode}
      </div>
      <div ref={refRight} style={rightStyle}>
        {rightNode}
      </div>
      {children}
    </div>
  );
};

const GAP = 5;
const COMMON_STYLES: React.CSSProperties = {
  position: "absolute",
  transition: "all 200ms cubic-bezier(.47,1.64,.41,.8)",
  transitionProperty: "transform, top, left, bottom, right",
};
const STYLES: Record<string, React.CSSProperties> = {
  TOP_LEFT: {
    ...COMMON_STYLES,
    left: GAP,
    top: -GAP,
    transform: "translateY(-100%)",
  },
  LEFT: {
    ...COMMON_STYLES,
    left: GAP,
    top: "50%",
    transform: "translateY(-50%)",
  },
  BOTTOM_LEFT: {
    ...COMMON_STYLES,
    left: GAP,
    bottom: -GAP,
    transform: "translateY(100%)",
  },
  TOP_RIGHT: {
    ...COMMON_STYLES,
    right: GAP,
    top: -GAP,
    transform: "translateY(-100%)",
  },
  RIGHT: {
    ...COMMON_STYLES,
    right: GAP,
    top: "50%",
    transform: "translateY(-50%)",
  },
  BOTTOM_RIGHT: {
    ...COMMON_STYLES,
    right: GAP,
    bottom: -GAP,
    transform: "translateY(100%)",
  },
};
