import React, { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import "../../css/auth.css";

export const Route = createFileRoute("/_auth/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameOrEmail) return toast.error("Username or Email required");
    if (!password) return toast.error("Password required");

    // Users in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]") as {
      username: string;
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      role: "client" | "vendor";
    }[];


    // Match by username or email
    const matchedUser = users.find(
      (user) =>
        (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
        user.password === password
    );

    if (!matchedUser) {
      return toast.error("Invalid credentials");
    }

    // Use auth context (without password)
    // Use auth context (without password)
    router.options.context.auth.login({
      username: matchedUser.username,
      email: matchedUser.email,
      role: matchedUser.role,
    });


    toast.success("Login successful!", { duration: 1500 });

    setTimeout(() => {
      navigate({ to: matchedUser.role === "client" ? "/pages/client" : "/pages/vendor" });
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo + Branding */}
        <div className="auth-logo">
          <img src="/helpdesk-logo.png" alt="Logo" />
        </div>
        <h1 className="auth-brand">HelpDesk</h1>
        <h2 className="auth-title">User Login</h2>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter username or email"
              required
            />
          </div>

          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="password">Password</label>
              <a href="/auth/resetpassword" className="auth-link">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-btn auth-btn-primary">
              Login
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don’t have an account? <a href="/auth/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
