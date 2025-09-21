import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "@/css/login.module.css";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Confirm Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ResetPasswordPage() {
    const navigate = useNavigate();
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
            password: string;
            role: "client" | "vendor";
        }[];

        const userIndex = users.findIndex((user) => user.email === data.email);

        if (userIndex === -1) {
            setAuthError(true);
            return toast.error("User not found");
        }

        users[userIndex].password = data.newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        toast.success("Password reset successful!", { duration: 1500 });

        setTimeout(() => {
            navigate({ to: "/auth/login" });
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
                <h2 className={styles.formTitle}>Reset Password</h2>

                {/* Email field */}
                <label className={styles.formLabel} htmlFor="email">Email:</label>
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

                {/* New Password */}
                <label className={styles.formLabel} htmlFor="newPassword">New Password:</label>
                <input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    className={getInputClass("newPassword")}
                    placeholder="Enter new password"
                />
                <p className={`${styles.errorMessage} ${errors.newPassword ? styles.active : ""}`}>
                    {errors.newPassword?.message ? `${errors.newPassword.message} ❌` : ""}
                </p>

                {/* Confirm Password */}
                <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={getInputClass("confirmPassword")}
                    placeholder="Confirm new password"
                />
                <p className={`${styles.errorMessage} ${errors.confirmPassword ? styles.active : ""}`}>
                    {errors.confirmPassword?.message ? `${errors.confirmPassword.message} ❌` : ""}
                </p>

                <button type="submit" className={styles.formSubmit}>
                    Reset Password
                </button>

                <div className={styles.formLinks}>
                    <a href="/auth/login" className={styles.formLink}>
                        Remembered password? Login
                    </a>
                </div>
            </form>
        </div>
    );
}
