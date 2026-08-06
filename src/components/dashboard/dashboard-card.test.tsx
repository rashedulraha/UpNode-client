import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardCard } from "./dashboard-card";

describe("DashboardCard Component", () => {
	it("renders title and numerical value correctly", () => {
		render(<DashboardCard title="Active Incidents" value="4" />);

		expect(screen.getByText("Active Incidents")).toBeDefined();
		expect(screen.getByText("4")).toBeDefined();
	});

	it("renders percentage change and trend indicator", () => {
		render(
			<DashboardCard
				title="Avg Response Time"
				value="34ms"
				change="-12ms vs last hour"
				changeType="positive"
			/>,
		);

		expect(screen.getByText("34ms")).toBeDefined();
		expect(screen.getByText("-12ms vs last hour")).toBeDefined();
	});

	it("renders status badge when status prop is passed", () => {
		render(
			<DashboardCard
				title="PostgreSQL Cluster"
				value="Operational"
				status="OPERATIONAL"
			/>,
		);

		expect(screen.getByText("OPERATIONAL")).toBeDefined();
	});

	it("renders CRITICAL status badge correctly", () => {
		render(
			<DashboardCard
				title="Payment Ingestion API"
				value="Down"
				status="CRITICAL"
			/>,
		);

		expect(screen.getByText("CRITICAL")).toBeDefined();
	});

	it("triggers onClick handler when card is clicked", () => {
		const handleClick = vi.fn();
		render(
			<DashboardCard
				title="Clickable Metric"
				value="100"
				onClick={handleClick}
			/>,
		);

		const card = screen.getByTestId("dashboard-card");
		fireEvent.click(card);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
