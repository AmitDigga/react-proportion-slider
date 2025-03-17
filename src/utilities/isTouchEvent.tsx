export function isTouchEvent(
  e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): e is TouchEvent | React.TouchEvent {
  return "touches" in e;
}
