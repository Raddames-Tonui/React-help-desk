import { createFileRoute } from "@tanstack/react-router";
import UnderDevelopmentPage from "@/pages/auth/UnderDevelopmentPage.tsx";

export const Route = createFileRoute("/_public/auth/underdevelopment")({
    component: UnderDevelopmentPage,
});
