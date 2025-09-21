import { createFileRoute } from "@tanstack/react-router";
import UnauthorizedPage from "@/pages/auth/UnauthorizedPage.tsx";

export const Route = createFileRoute("/_public/auth/unauthorized")({
    component: UnauthorizedPage,
});
