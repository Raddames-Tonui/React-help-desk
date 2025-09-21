import { createFileRoute } from '@tanstack/react-router'
import Subjects from "@/pages/Subjects.tsx";

export const Route = createFileRoute('/_protected/admin/subjects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section>
    <Subjects />
  </section>
}
