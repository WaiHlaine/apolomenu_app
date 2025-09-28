"use client";

import { ColumnDef } from "@tanstack/react-table";

interface GetColumnsOptions<T> {
  withActions?: boolean;
  renderActions?: (row: T) => React.ReactNode;
  renderIcon?: (row: T) => React.ReactNode;
  additionalColumns?: ColumnDef<T>[]; // NEW: support extra columns
}

export function getColumns<T>(options: GetColumnsOptions<T> = {}): ColumnDef<T>[] {
  const baseColumns: ColumnDef<T>[] = [];

  // Optional icon column
  if (options.renderIcon) {
    baseColumns.push({
      id: "icon",
      header: "Icon",
      cell: ({ row }) => options.renderIcon!(row.original),
    });
  }

  // Always include Name column by default
  baseColumns.push({
    accessorKey: "name",
    header: "Name",
  });

  // Add additional columns if provided
  if (options.additionalColumns && options.additionalColumns.length > 0) {
    baseColumns.push(...options.additionalColumns);
  }

  // Optional actions column
  if (options.withActions && options.renderActions) {
    baseColumns.push({
      id: "actions",
      // header: "Actions", // optional
      cell: ({ row }) => options.renderActions!(row.original),
    });
  }

  return baseColumns;
}
