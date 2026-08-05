import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthForm } from "./auth-form";

describe("AuthForm Component", () => {
  it("renders sign in mode by default", () => {
    render(<AuthForm mode="signin" />);

    expect(screen.getByRole("heading", { name: /\[SIGN_IN\]/i })).toBeDefined();
    expect(screen.getByLabelText(/Work Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /^Sign In$/i })).toBeDefined();
  });

  it("renders sign up mode when mode='signup' is passed", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByRole("heading", { name: /\[CREATE_ACCOUNT\]/i })).toBeDefined();
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /^Create Account$/i })).toBeDefined();
  });

  it("shows validation error when email is empty on submit", async () => {
    render(<AuthForm mode="signin" />);

    const submitBtn = screen.getByRole("button", { name: /^Sign In$/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Email is required")).toBeDefined();
  });

  it("shows validation error when password is less than 6 characters", async () => {
    render(<AuthForm mode="signin" />);

    const emailInput = screen.getByLabelText(/Work Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /^Sign In$/i });

    fireEvent.change(emailInput, { target: { value: "user@company.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Password must be at least 6 characters")).toBeDefined();
  });

  it("calls onSubmit with valid form values", async () => {
    const handleSubmit = vi.fn();
    render(<AuthForm mode="signin" onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/Work Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /^Sign In$/i });

    fireEvent.change(emailInput, { target: { value: "admin@company.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "admin@company.com",
      password: "password123",
    });
  });

  it("displays errorMessage banner when provided", () => {
    render(<AuthForm errorMessage="Invalid email or password credentials" />);

    expect(screen.getByText("Invalid email or password credentials")).toBeDefined();
  });

  it("toggles mode from Sign In to Sign Up on link click", () => {
    render(<AuthForm mode="signin" />);

    const toggleBtn = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByRole("heading", { name: /\[CREATE_ACCOUNT\]/i })).toBeDefined();
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
  });

  it("calls onSocialSubmit when Google or GitHub button is clicked", () => {
    const handleSocialSubmit = vi.fn();
    render(<AuthForm onSocialSubmit={handleSocialSubmit} />);

    const googleBtn = screen.getByRole("button", { name: /Sign in with Google/i });
    const githubBtn = screen.getByRole("button", { name: /Sign in with GitHub/i });

    fireEvent.click(googleBtn);
    expect(handleSocialSubmit).toHaveBeenCalledWith("google");

    fireEvent.click(githubBtn);
    expect(handleSocialSubmit).toHaveBeenCalledWith("github");
  });
});
