import React from "react";
import { isTouchEvent } from "./isTouchEvent";

export type EventType =
  | MouseEvent
  | TouchEvent
  | React.MouseEvent
  | React.TouchEvent;

export const getClientX = (e: EventType): number => {
  return isTouchEvent(e) ? e.touches[0].clientX : e.clientX;
};
