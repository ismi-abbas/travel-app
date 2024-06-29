import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/data-table/dataTable.jsx";
import { columns } from "../../components/data-table/columns.jsx";
import supabase from "../../lib/supabase";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-admin-places"],
    queryFn: async (page = 0) => {
      try {
        const { data, error } = await supabase.from("places").select().order("name", { ascending: true });

        if (error) {
          throw new Error(error);
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    gcTime: 1000 * 60 * 5,
  });

  return (
    <div className="w-full mt-8 mb-10 flex items-center flex-col">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {data && <DataTable columns={columns} defaultData={data} />}
    </div>
  );
}
