import { createFileRoute } from '@tanstack/react-router'
import SubjectsPage from "@/pages/SubjectsPage";

export const Route = createFileRoute('/_protected/admin/subjects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section>
    <SubjectsPage />
  </section>
}
