import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions } from "../catalog.index";
import { DataTable } from "../../components/data-table/dataTable.jsx";
import { columns } from "../../components/data-table/columns.jsx";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isError, isLoading } = useQuery(catalogQueryOptions());

  return (
    <div className="w-full">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
