"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableFilterableColumn, DataTableSearchableColumn } from "@/@types/TDataTable";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { LandPlotIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filterableColumns?: DataTableFilterableColumn<TData>[]
	searchableColumns?: DataTableSearchableColumn<TData>[]
}

export function DataTable<TData, TValue>({
											 columns,
											 data,
											 filterableColumns = [],
											 searchableColumns = [],
										 }: DataTableProps<TData, TValue>) {
	const pageCount = Math.ceil(data.length / 20);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Search params
	const page = searchParams?.get("page") ?? "1";
	const per_page = searchParams?.get("per_page") ?? "10";
	const sort = searchParams?.get("sort");
	const [column, order] = sort?.split(".") ?? [];

	// Create query string
	const createQueryString = useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString());

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key);
				} else {
					newSearchParams.set(key, String(value));
				}
			}

			return newSearchParams.toString();
		},
		[searchParams]
	);

	// Table states
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Handle server-side pagination
	const [{ pageIndex, pageSize }, setPagination] =
		useState<PaginationState>({
			pageIndex: Number(page) - 1,
			pageSize: Number(per_page),
		});

	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	);

	useEffect(() => {
		setPagination({
			pageIndex: Number(page) - 1,
			pageSize: Number(per_page),
		});
	}, [page, per_page]);

	useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page: pageIndex + 1,
				per_page: pageSize,
			})}`
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageIndex, pageSize]);

	// Handle server-side sorting
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: column ?? "",
			desc: order === "desc",
		},
	]);

	useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page,
				sort: sorting[0]?.id
					? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
					: null,
			})}`
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting]);

	// Handle server-side filtering
	const debouncedSearchableColumnFilters = JSON.parse(
		useDebounce(
			JSON.stringify(
				columnFilters.filter((filter) => {
					return searchableColumns.find((column) => column.id === filter.id);
				})
			),
			500
		)
	) as ColumnFiltersState;

	const filterableColumnFilters = columnFilters.filter((filter) => {
		return filterableColumns.find((column) => column.id === filter.id);
	});

	useEffect(() => {
		for (const column of debouncedSearchableColumnFilters) {
			if (typeof column.value === "string") {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: typeof column.value === "string" ? column.value : null,
					})}`
				);
			}
		}

		// @ts-ignore
		for (const key of searchParams.keys()) {
			if (
				searchableColumns.find((column) => column.id === key) &&
				!debouncedSearchableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(debouncedSearchableColumnFilters)]);

	useEffect(() => {
		for (const column of filterableColumnFilters) {
			if (typeof column.value === "object" && Array.isArray(column.value)) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: column.value.join("."),
					})}`
				);
			}
		}

		// @ts-ignore
		for (const key of searchParams.keys()) {
			if (
				filterableColumns.find((column) => column.id === key) &&
				!filterableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(filterableColumnFilters)]);

	const table = useReactTable({
		data,
		columns,
		pageCount: pageCount ?? -1,
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange:setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: false,
		manualSorting: false,
		manualFiltering: false,
		manualGrouping: false,
		manualExpanding: false,
		debugColumns: true
	});
	return (
		<div>
			<DataTableToolbar
				table={table}
				filterableColumns={filterableColumns}
				searchableColumns={searchableColumns}
			/>
			<div className="rounded-md border">
				{
					table.getRowModel().rows?.length > 0 ?
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								}
							</TableBody>
						</Table> :
						<div className="h-24 text-center text-sm font-medium text-slate-500 flex flex-row items-center justify-center">
							<LandPlotIcon strokeWidth={1.3} color={"#64748b"} className={"mr-3"}/> Nothing much to seee
						</div>
				}
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}