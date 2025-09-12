import React from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const Route = createFileRoute("/_auth/auth/login")({
  component: LoginPage,
});

const schema = yup.object({
  usernameOrEmail: yup.string().required("Username or Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
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
      return toast.error("Invalid credentials");
    }

    router.options.context.auth.login(matchedUser);

    toast.success("Login successful!", { duration: 1500 });

    setTimeout(() => {
      navigate({
        to: matchedUser.role === "client" ? "/pages/client" : "/pages/vendor",
      });
    }, 1500);
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
          className="form-input"
          placeholder="Enter username or email"
        />
        {errors.usernameOrEmail && (
          <p className="error-message">{errors.usernameOrEmail.message}</p>
        )}

        <label className="form-label" htmlFor="password">
          Password:
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="form-input"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <button type="submit" className="form-submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
