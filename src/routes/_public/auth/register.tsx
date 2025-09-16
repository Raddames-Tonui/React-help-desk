import React, { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "@/css/login.module.css";

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
});

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
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
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { role: "client" },
  });

  const getInputClass = (field: keyof FormData) => {
    if (errors[field]) return `${styles.formInput} ${styles.error}`;
    if (authError && isSubmitted) return `${styles.formInput} ${styles.neutral}`;
    if (touchedFields[field]) return `${styles.formInput} ${styles.success}`;
    return styles.formInput;
  };

  const onSubmit = (data: FormData) => {
    setAuthError(false);

    const existingUsers =
      JSON.parse(localStorage.getItem("users") || "[]") as Omit<
        FormData,
        "confirmPassword"
      >[];

    if (existingUsers.find((user) => user.email === data.email)) {
      setAuthError(true);
      return toast.error("Email already exists");
    }

    const { confirmPassword, ...userData } = data;
    const updatedUsers = [...existingUsers, userData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success("Registration successful!", { duration: 1500 });

    setTimeout(() => {
      navigate({ to: "/auth/login" });
    }, 1500);
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <h2 className={styles.formTitle}>Register</h2>

        {/* First Name */}
        <label className={styles.formLabel} htmlFor="firstName">
          First Name:
        </label>
        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className={getInputClass("firstName")}
          placeholder="Enter first name"
        />
        <p className={`${styles.errorMessage} ${errors.firstName ? styles.active : ""}`}>
          {errors.firstName?.message ? `${errors.firstName.message} ❌` : ""}
        </p>

        {/* Last Name */}
        <label className={styles.formLabel} htmlFor="lastName">
          Last Name:
        </label>
        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className={getInputClass("lastName")}
          placeholder="Enter last name"
        />
        <p className={`${styles.errorMessage} ${errors.lastName ? styles.active : ""}`}>
          {errors.lastName?.message ? `${errors.lastName.message} ❌` : ""}
        </p>

        {/* Email */}
        <label className={styles.formLabel} htmlFor="email">
          Email:
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={getInputClass("email")}
          placeholder="Enter email"
        />
        <p className={`${styles.errorMessage} ${errors.email ? styles.active : ""}`}>
          {errors.email?.message ? `${errors.email.message} ❌` : ""}
        </p>

        {/* Password */}
        <label className={styles.formLabel} htmlFor="password">
          Password:
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={getInputClass("password")}
          placeholder="Enter password"
        />
        <p className={`${styles.errorMessage} ${errors.password ? styles.active : ""}`}>
          {errors.password?.message ? `${errors.password.message} ❌` : ""}
        </p>

        {/* Confirm Password */}
        <label className={styles.formLabel} htmlFor="confirmPassword">
          Confirm Password:
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className={getInputClass("confirmPassword")}
          placeholder="Confirm password"
        />
        <p className={`${styles.errorMessage} ${errors.confirmPassword ? styles.active : ""}`}>
          {errors.confirmPassword?.message ? `${errors.confirmPassword.message} ❌` : ""}
        </p>

        {/* Role */}
        <label className={styles.formLabel} htmlFor="role">
          Role:
        </label>
        <select id="role" {...register("role")} className={styles.formInput}>
          <option value="client">Client</option>
          <option value="vendor">Vendor</option>
        </select>

        <button type="submit" className={styles.formSubmit}>
          Register
        </button>

        <div className={styles.formLinks}>
          <a href="/auth/login" className={styles.formLink}>
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
