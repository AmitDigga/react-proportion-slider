import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProportionSlider } from "../src";

describe("ProportionSlider", () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <ProportionSlider
        value={[0, 0]}
        onChange={() => {}}
        proportions={[
          {
            name: "A",
          },
          {
            name: "B",
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
        proportions={[{ name: "Left Side" }, { name: "Right Side" }]}
      />
    );

    expect(screen.getByText("Left Side")).toBeDefined();
    expect(screen.getByText("Right Side")).toBeDefined();
  });

  it("calls onChange when slider knob is moved", async () => {
    const mockOnChange = vi.fn();
    // userEvent.setup();

    render(
      <ProportionSlider
        value={[50, 50]}
        onChange={mockOnChange}
        proportions={[{ name: "A" }, { name: "B" }]}
      />
    );

    const slider = screen.getByRole("slider");
    const knob = slider.querySelector("div[role='button']");
    expect(knob).toBeDefined();

    // Simulate drag start
    fireEvent.mouseDown(knob as HTMLElement);
    // Simulate drag movement
    fireEvent.mouseMove(window, { clientX: 100 });
    // Simulate drag end
    fireEvent.mouseUp(window);

    expect(mockOnChange).toHaveBeenCalled();
  });
});
