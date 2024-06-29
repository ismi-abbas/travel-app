import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "../../lib/utils.js";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { TableCell } from "./table.jsx";

const columnHelper = createColumnHelper();

export const EditTableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onValueChange = (e) => {
    setValue(e.target.value);
  };

  const onSelectChange = (e) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };

  if (tableMeta?.editedRows[row.id]) {
    return (
      <Fragment>
        {columnMeta?.type === "select" ? (
          <select onChange={onSelectChange} value={initialValue}>
            {column.columnDef.meta.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={value ? value : ""}
            onChange={onValueChange}
            onBlur={onBlur}
            className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0")}
            type={column.columnDef.meta?.type || "text"}
          />
        )}
      </Fragment>
    );
  }

  return <span>{value}</span>;
};

const EditButtonCell = ({ row, table }) => {
  const meta = table.options.meta;

  const setEditedRows = (e) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    }
  };

  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="flex gap-2">
          <button onClick={setEditedRows} name="cancel" className="py-1 px-2 bg-red-500 rounded-md text-white">
            Cancel
          </button>
          <button onClick={setEditedRows} name="done" className="py-1 px-2 bg-green-500 rounded-md text-white">
            Done
          </button>
        </div>
      ) : (
        <button onClick={setEditedRows} name="edit" className="py-1 px-2 bg-orange-500 rounded-md text-white">
          Edit
        </button>
      )}
    </div>
  );
};

export const columns = [
  columnHelper.display({
    id: "edit",
    cell: EditButtonCell,
  }),
  columnHelper.accessor("id", {
    header: "ID",
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: EditTableCell,
    meta: {
      type: "select",
      options: [
        {
          value: "HOTEL",
          label: "HOTEL",
        },
        {
          value: "RESTAURANT",
          label: "RESTAURANT",
        },
        {
          value: "ATTRACTION",
          label: "ATTRACTION",
        },
      ],
    },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("image", {
    header: "Image",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("subcategory", {
    header: "Subcategory",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("address_street_1", {
    header: "Address 1",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: EditTableCell,
    meta: {
      type: "email",
    },
  }),
  columnHelper.accessor("latitude", {
    header: "Latitude",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("longitude", {
    header: "Longitude",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("number_of_reviews", {
    header: "Reviews",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("price_range", {
    header: "Price Range",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("price_level", {
    header: "Price Level",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("hotel_class", {
    header: "Hotel Class",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("address_street_2", {
    header: "Address 2",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("city", {
    header: "City",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("state", {
    header: "State",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("postal_code", {
    header: "Postal Code",
    cell: EditTableCell,
    meta: {
      type: "text",
    },
  }),
];
