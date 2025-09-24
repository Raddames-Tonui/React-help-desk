import type { ApiResponse, SubjectData } from "@/context/types";
import { TOKEN } from "@/utils/Constants";

export async function fetchSubjects({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<ApiResponse<SubjectData>> {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  }).toString();

  const response = await fetch(`/api/admin/subjects/?${query}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || `Failed (status ${response.status})`);
  }

  return response.json() as Promise<ApiResponse<SubjectData>>;
}
