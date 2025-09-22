import { createFileRoute } from "@tanstack/react-router";
import SubjectsPage from "@/pages/subjects/SubjectsPage";

export const Route = createFileRoute("/_protected/admin/subjects/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 10,
      sortBy: (search.sortBy as string) ?? "",
    };
  },
});

function RouteComponent() {
  return (
    <section>
      <SubjectsPage />
    </section>
  );
}
