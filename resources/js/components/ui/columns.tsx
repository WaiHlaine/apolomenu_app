"use client";

import { ColumnDef } from "@tanstack/react-table";

interface GetColumnsOptions<T> {
  withActions?: boolean;
  withBaseColumns?: boolean
  renderActions?: (row: T) => React.ReactNode;
  renderIcon?: (row: T) => React.ReactNode;
  renderIconName?: string;
  additionalColumns?: ColumnDef<T>[]; // NEW: support extra columns
}

export function getColumns<T>({
  withActions,
  withBaseColumns = true,
  renderActions,
  renderIcon,
  renderIconName,
  additionalColumns
}: GetColumnsOptions<T> = {}): ColumnDef<T>[] {
  const baseColumns: ColumnDef<T>[] = [];

  // Optional icon column
  if (renderIcon) {
    baseColumns.push({
      id: renderIconName || "icon",
      header: renderIconName || "Icon",
      cell: ({ row }) => renderIcon!(row.original),
    });
  }

  // Always include Name column by default
  if (withBaseColumns) {
    baseColumns.push({
    accessorKey: "name",
    header: "Name",
  });
  }

  // Add additional columns if provided
  if (additionalColumns && additionalColumns.length > 0) {
    baseColumns.push(...additionalColumns);
  }

  // Optional actions column
  if (withActions && renderActions) {
    baseColumns.push({
      id: "actions",
      // header: "Actions", // optional
      cell: ({ row }) => renderActions!(row.original),
    });
  }

  return baseColumns;
}
