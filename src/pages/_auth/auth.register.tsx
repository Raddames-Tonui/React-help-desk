import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


export const Route = createFileRoute("/_auth/auth/register")({
  component: RegisterPage,
});

// Validation schema
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

    localStorage.setItem("users", JSON.stringify([...existingUsers, data]));
    toast.success("Registration successful!");

    setTimeout(() => {
      navigate({ to: "/auth/login" });
    }, 1500);
  };

  return (
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Branding */}
          <div className="auth-logo">
            <img src="/helpdesk-logo.png" alt="Logo" />
          </div>
          <h1 className="auth-brand">HelpDesk</h1>
          <h2 className="auth-title">Create Account</h2>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                {...register("firstName")}
                placeholder="Enter first name"
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <p className="auth-error-message">{errors.firstName.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                {...register("lastName")}
                placeholder="Enter last name"
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <p className="auth-error-message">{errors.lastName.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                {...register("username")}
                placeholder="Choose a username"
                className={errors.username ? "error" : ""}
              />
              {errors.username && (
                <p className="auth-error-message">{errors.username.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email address"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <p className="auth-error-message">{errors.email.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter password"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <p className="auth-error-message">{errors.password.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <p className="auth-error-message">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                {...register("role")}
                className={errors.role ? "error" : ""}
              >
                <option value="client">Client</option>
                <option value="vendor">Vendor</option>
              </select>
              {errors.role && (
                <p className="auth-error-message">{errors.role.message}</p>
              )}
            </div>

            <div className="auth-actions">
              <button type="submit" className="auth-btn auth-btn-primary">
                Register
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account? <a href="/auth/login">Login</a>
          </p>
        </div>
      </div>
  );
}

export default RegisterPage;
