import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "@/css/register.css";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

// Yup validation schema
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
    formState: { errors, touchedFields },
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

  // 🔹 helper for styling
  const getInputClass = (field: keyof FormData) => {
    if (errors[field]) return "form-input error"; // red
    if (touchedFields[field]) return "form-input success"; // green
    return "form-input"; // default gray
  };

  // 🔹 helper for icons
  const renderIcon = (field: keyof FormData) => {
    if (errors[field]) return <span className="error-icon">❌</span>;
    if (touchedFields[field]) return <span className="success-icon">✔️</span>;
    return null;
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2 className="form-title">Sign Up</h2>

        {(
          [
            { id: "firstName", label: "First Name", type: "text" },
            { id: "lastName", label: "Last Name", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "password", label: "Password", type: "password" },
            {
              id: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
          ] as const
        ).map((field) => (
          <div key={field.id} className="input-wrapper">
            <label className="form-label" htmlFor={field.id}>
              {field.label}:
            </label>
            <div className="input-with-icon">
              <input
                id={field.id}
                type={field.type}
                {...register(field.id)}
                className={getInputClass(field.id)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
              {renderIcon(field.id)}
            </div>
            {errors[field.id] && (
              <p className="error-message">{errors[field.id]?.message}</p>
            )}
          </div>
        ))}

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
