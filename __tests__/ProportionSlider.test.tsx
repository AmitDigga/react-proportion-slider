import React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterAll,
  beforeAll,
} from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ProportionSlider } from "../src";

describe("ProportionSlider", () => {
  const boundingClientRect = {
    width: 100,
    height: 100,
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  };

  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeAll(() => {
    Element.prototype.getBoundingClientRect = () => boundingClientRect;
  });

  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
    cleanup();
  });

  it("renders without crashing", () => {
    render(
      <ProportionSlider
        value={[0, 0]}
        onChange={() => {}}
        proportions={[
          {
            label: "A",
          },
          {
            label: "B",
          },
        ]}
      />
    );
    expect(screen.getByRole("slider")).toBeDefined();
  });

  it("displays proportion names correctly", () => {
    render(
      <ProportionSlider
        value={[50, 50]}
        onChange={() => {}}
        proportions={[{ label: "Left Side" }, { label: "Right Side" }]}
      />
    );

    expect(screen.getAllByText("Left Side")).toHaveLength(2);
    expect(screen.getAllByText("Right Side")).toHaveLength(2);
  });

  it("calls onChange when slider knob is moved", async () => {
    const mockOnChange = vi.fn();
    // userEvent.setup();

    render(
      <ProportionSlider
        value={[50, 50]}
        onChange={mockOnChange}
        proportions={[{ label: "A" }, { label: "B" }]}
      />
    );

    const slider = screen.getByRole("slider");
    expect(slider).toBeDefined();

    expect(slider.getBoundingClientRect().width).toBe(100); // mocked

    // Simulate drag start
    fireEvent.mouseDown(slider as HTMLElement, { clientX: 50 });
    // Simulate drag movement
    fireEvent.mouseMove(window, { clientX: 45 });
    // Simulate drag end
    fireEvent.mouseUp(window);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("works on mobile", async () => {
    const mockOnChange = vi.fn();
    // userEvent.setup();

    render(
      <ProportionSlider
        value={[50, 50]}
        onChange={mockOnChange}
        proportions={[{ label: "A" }, { label: "B" }]}
      />
    );

    const slider = screen.getByRole("slider");
    expect(slider).toBeDefined();

    expect(slider.getBoundingClientRect().width).toBe(100); // mocked

    // Simulate drag start
    fireEvent.touchStart(slider as HTMLElement, { touches: [{ clientX: 50 }] });
    // Simulate drag movement
    fireEvent.touchMove(window, { touches: [{ clientX: 45 }] });
    // Simulate drag end
    fireEvent.touchEnd(window);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
