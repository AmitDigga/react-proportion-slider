import React, { useRef, useState, useMemo, useEffect } from "react";

export const DynamicChildPositioner = ({
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
export type DynamicChildPositionerProps = {
  rightNode: React.ReactNode;
  leftNode: React.ReactNode;
  options: {
    primary: "left" | "right";
  };
  backgroundColor?: string;
  width: number | string;
};

export const GAP = 5;
export const STYLES = {
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
