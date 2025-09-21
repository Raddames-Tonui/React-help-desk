import type {SortRule} from "@components/table/DataTable.tsx";


export const initialSortFromUrl: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy.split(",").map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" }
    }) : [{ column: "id", direction: "asc" }];
