import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.tsx";

export const Route = createFileRoute("/_public/auth/resetpassword")({
    component: ResetPasswordPage,
});
