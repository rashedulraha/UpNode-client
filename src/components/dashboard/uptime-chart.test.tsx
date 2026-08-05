import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UptimeChart } from "./uptime-chart";

describe("UptimeChart Component", () => {
  it("renders default title, uptime SLA, and latency metric", () => {
    render(<UptimeChart uptimePercentage={99.99} averageLatencyMs={24} />);

    expect(screen.getByText("Uptime & Telemetry Status")).toBeDefined();
    expect(screen.getByText("99.99%")).toBeDefined();
    expect(screen.getByText("24 ms")).toBeDefined();
  });

  it("renders custom title when title prop is provided", () => {
    render(<UptimeChart title="Production API Gateway Uptime" />);

    expect(screen.getByText("Production API Gateway Uptime")).toBeDefined();
  });

  it("renders timeframe selection buttons and handles range changes", () => {
    const handleRangeChange = vi.fn();
    render(<UptimeChart onTimeRangeChange={handleRangeChange} />);

    const btn7d = screen.getByRole("button", { name: "7d" });
    fireEvent.click(btn7d);

    expect(handleRangeChange).toHaveBeenCalledWith("7d");
  });

  it("renders status bars for provided telemetry points", () => {
    const sampleData = [
      { timestamp: "10:00", latencyMs: 15, status: "UP" as const },
      { timestamp: "10:05", latencyMs: 120, status: "DEGRADED" as const },
      { timestamp: "10:10", latencyMs: 0, status: "DOWN" as const },
    ];

    render(<UptimeChart dataPoints={sampleData} />);

    expect(screen.getByText("Check Intervals (3 nodes)")).toBeDefined();
    expect(screen.getByTitle("10:00: 15ms (UP)")).toBeDefined();
    expect(screen.getByTitle("10:05: 120ms (DEGRADED)")).toBeDefined();
    expect(screen.getByTitle("10:10: 0ms (DOWN)")).toBeDefined();
  });
});
