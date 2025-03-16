import React from "react";

type HiddenSpaceTakerProps = {
  children: React.ReactNode;
};
export const HiddenSpaceTaker = ({ children }: HiddenSpaceTakerProps) => (
  <span aria-hidden="true" style={{ visibility: "hidden" }}>
    {children}
  </span>
);
