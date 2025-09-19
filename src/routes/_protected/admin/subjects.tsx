import { createFileRoute } from '@tanstack/react-router'
import Subjects from "@/pages/Subjects.tsx";

export const Route = createFileRoute('/_protected/admin/subjects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section>
          <div className="page-header">
              <h1>Subjects</h1>
      </div>
      <Subjects />
  </section>
}
