import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.jsx";
import { Fragment, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../../lib/supabase.js";
import toast from "react-hot-toast";

const updatePlace = async ({ value, placeId, column }) => {
  const { data, error } = await supabase
    .from("places")
    .update({
      [column]: value,
    })
    .eq("id", placeId)
    .select();
  if (error) throw error;
  return data;
};

export function DataTable({ columns, defaultData }) {
  const [data, setData] = useState(() => [...defaultData]);
  const [editedRows, setEditedRows] = useState({});
  const [originalData, setOriginalData] = useState(() => [...defaultData]);
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updatePlace,
    mutationKey: "updatePlace",
    onError: (e) => {
      toast(`Failed to edit place ${e}`);
    },
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination,
    },
    meta: {
      editedRows,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
        mutate({
          value: value,
          placeId: data[rowIndex].id,
          column: columnId,
        });

        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
        } else {
          setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
        }
      },
    },
  });

  return (
    <Fragment>
      <Table className="bg-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-2 gap-2 flex">
        <button
          className="border border-orange-500 rounded-md px-2 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev Page
        </button>

        <button
          className="border border-orange-500 rounded-md px-2 hover:bg-orange-500 hover:text-white"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next Page
        </button>
      </div>
    </Fragment>
  );
}
