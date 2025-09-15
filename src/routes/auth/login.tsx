import React, { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "@/css/login.module.css";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
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
      email: string;
      firstname: string;
      lastname: string;
      password: string;
      role: "client" | "vendor";
    }[];

    const matchedUser = users.find(
      (user) => user.email === data.email && user.password === data.password
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
    if (errors[field]) return `${styles.formInput} ${styles.error}`;
    if (authError && isSubmitted) return `${styles.formInput} ${styles.neutral}`;
    if (touchedFields[field]) return `${styles.formInput} ${styles.success}`;
    return styles.formInput;
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <h2 className={styles.formTitle}>Login</h2>

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
        <p
          className={`${styles.errorMessage} ${
            errors.email ? styles.active : ""
          }`}
        >
          {errors.email?.message ? `${errors.email.message} ❌` : ""}
        </p>

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
        <p
          className={`${styles.errorMessage} ${
            errors.password ? styles.active : ""
          }`}
        >
          {errors.password?.message ? `${errors.password.message} ❌` : ""}
        </p>

        <a href="/auth/resetpassword" className={styles.formLink}>
          Forgot your password?
        </a>

        <button type="submit" className={styles.formSubmit}>
          Login
        </button>

        <div className={styles.formLinks}>
          <a href="/auth/register" className={styles.formLink}>
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
