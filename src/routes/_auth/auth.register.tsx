import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "@/css/register.css"

export const Route = createFileRoute("/_auth/auth/register")({
  component: RegisterPage,
});

// Yap validation schema 
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup.mixed<"client" | "vendor">().oneOf(["client", "vendor"]),
});

type FormData = yup.InferType<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { role: "client" },
  });

  const onSubmit = (data: FormData) => {
    const existingUsers =
      JSON.parse(localStorage.getItem("users") || "[]") as FormData[];

    if (existingUsers.find((user) => user.username === data.username)) {
      return toast.error("Username already exists");
    }

    if (existingUsers.find((user) => user.email === data.email)) {
      return toast.error("Email already exists");
    }

    const updatedUsers = [...existingUsers, data];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success("Registration successful!");

    setTimeout(() => {
      navigate({ to: "/auth/login" });
    }, 1500);
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2 className="form-title">Sign Up</h2>

        <label className="form-label" htmlFor="firstName">
          First Name:
        </label>
        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className="form-input"
          placeholder="Enter first name"
        />
        {errors.firstName && (
          <p className="error-message">{errors.firstName.message}</p>
        )}

        <label className="form-label" htmlFor="lastName">
          Last Name:
        </label>
        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className="form-input"
          placeholder="Enter last name"
        />
        {errors.lastName && (
          <p className="error-message">{errors.lastName.message}</p>
        )}

        <label className="form-label" htmlFor="username">
          Username:
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="form-input"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        <label className="form-label" htmlFor="email">
          Email:
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="form-input"
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
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

        <label className="form-label" htmlFor="confirmPassword">
          Confirm Password:
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="form-input"
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        <label className="form-label" htmlFor="role">
          Role:
        </label>
        <select id="role" {...register("role")} className="form-select">
          <option value="client">Client</option>
          <option value="vendor">Vendor</option>
        </select>

        <button type="submit" className="form-submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
