"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table";
import {useDataTableStore} from "@/store/dataTableStore";
import * as React from "react";
import {useState} from "react";
import {fuzzyFilter} from "@/lib/utils";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {DataTableInput} from "@/components/data-table/data-table-input";
import {DataTableExport} from "@/components/data-table/data-table-export";
import {DataTableColumnVisibility} from "@/components/data-table/data-table-column-visibility";
import {Table, TableHeader, TableRow} from "@/components/ui/table";
import {DataTableHeader} from "@/components/data-table/data-table-header";
import {DataTableBody} from "@/components/data-table/data-table-body";
import {DataTablePagination} from "@/components/data-table/data-table-pagination";
import {DataTableFloatingBar} from "@/components/data-table/data-table-floating-bar";
import {FilterFn} from "@tanstack/table-core";
import {RankingInfo} from "@tanstack/match-sorter-utils";

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData, TValue> {
		filterVariant?: 'text' | 'range' | 'select' | 'date';
	}
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}

interface IAdvancedDataTable<T> {
	columns: ColumnDef<T>[];
	data: T[];
	exportFileName: string;
}

export function AdvancedDataTable<T>({columns,data, exportFileName}:IAdvancedDataTable<T>) {
	const {isSelecting} = useDataTableStore(state => ({
		...state
	}));
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({})
	const [columnPinning, setColumnPinning] = useState({})
	const [columnOrder, setColumnOrder] = useState<string[]>(() =>
		columns.map(c => c.id!)
	)
	const [globalFilter, setGlobalFilter] = useState("")
	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			columnOrder,
			columnVisibility,
			columnPinning,
			globalFilter
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: "fuzzy",
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnPinningChange: setColumnPinning,
		onColumnOrderChange: setColumnOrder,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client-side filtering
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(), // client-side faceting
		getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
		getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
	});

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (active && over && active.id !== over.id) {
			setColumnOrder(columnOrder => {
				const oldIndex = columnOrder.indexOf(active.id as string)
				const newIndex = columnOrder.indexOf(over.id as string)
				return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
			})
		}
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	)

	const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

	return (
		<DndContext
			collisionDetection={closestCenter}
			modifiers={[restrictToHorizontalAxis]}
			onDragEnd={onDragEnd}
			sensors={sensors}>
			<div className="p-2 rounded mb-12">
				<div className={"flex flex-row items-center justify-between"}>
					<div className={"flex flex-row items-center"}>
						<DataTableInput
							value={globalFilter ?? ''}
							onChange={value => setGlobalFilter(String(value))}
							className="p-2 font-lg shadow border border-block"
							placeholder="Search anything..."
						/>
					</div>
					<div className={"flex flex-row items-center"}>
						<DataTableExport table={table} filename={exportFileName}/>
						<DataTableColumnVisibility table={table}/>
					</div>
				</div>
				<Table className={"mt-2"}>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								<SortableContext
									items={columnOrder}
									strategy={horizontalListSortingStrategy}>
									{headerGroup.headers.map(header => {
										return (
											<DataTableHeader key={header.id} header={header}/>
										)
									})}
								</SortableContext>
							</TableRow>
						))}
					</TableHeader>
					<DataTableBody table={table} columnOrder={columnOrder}/>
				</Table>
				<div className="h-2"/>
				<DataTablePagination table={table}/>
			</div>
			{isFiltered ? <DataTableFloatingBar table={table}/> : null}
		</DndContext>
	)
}