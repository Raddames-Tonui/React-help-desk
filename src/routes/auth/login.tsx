import React, { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "@/css/login.css";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

const schema = yup.object({
  usernameOrEmail: yup.string().required("Username or Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormData = yup.InferType<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setAuthError(false);

    const users = JSON.parse(localStorage.getItem("users") || "[]") as {
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      password: string;
      role: "client" | "vendor";
    }[];

    const matchedUser = users.find(
      (user) =>
        (user.username === data.usernameOrEmail ||
          user.email === data.usernameOrEmail) &&
        user.password === data.password
    );

    if (!matchedUser) {
      setAuthError(true);
      toast.error("Invalid credentials");
      return;
    }

    router.options.context.auth.login(matchedUser);
    toast.success("Login successful!", { duration: 1500 });

    setTimeout(() => {
      navigate({
        to: matchedUser.role === "client" ? "/pages/client" : "/pages/vendor",
      });
    }, 1500);
  };

  const getInputClass = (field: keyof FormData) => {
    if (errors[field]) return "form-input error"; // red
    if (authError && isSubmitted) return "form-input neutral"; // neutral if wrong creds
    if (touchedFields[field]) return "form-input success"; // green
    return "form-input";
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2 className="form-title">Login</h2>

        <label className="form-label" htmlFor="usernameOrEmail">
          Username or Email:
        </label>
        <input
          id="usernameOrEmail"
          type="text"
          {...register("usernameOrEmail")}
          className={getInputClass("usernameOrEmail")}
          placeholder="Enter username or email"
        />
        {errors.usernameOrEmail && (
          <p className="error-message">
            {errors.usernameOrEmail.message} ❌
          </p>
        )}

        <label className="form-label" htmlFor="password">
          Password:
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={getInputClass("password")}
          placeholder="Enter password"
        />        
        {errors.password && (
          <p className="error-message"> {errors.password.message} ❌</p>
        )}

        <a href="/auth/resetpassword" className="form-link">
          Forgot your password?
        </a>

        <button type="submit" className="form-submit">
          Login
        </button>

        <div className="form-links">
          <a href="/auth/register" className="form-link">Create account</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
