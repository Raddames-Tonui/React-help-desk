import { createFileRoute } from '@tanstack/react-router'
import LoginPage from "@/pages/auth/LoginPage.tsx";

export const Route = createFileRoute('/_public/auth/login')({
  component: LoginPage,
})

