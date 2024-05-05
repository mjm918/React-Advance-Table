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
	getSortedRowModel, Row,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table";
import {useDataTableStore} from "@/store/dataTableStore";
import * as React from "react";
import {useEffect, useState} from "react";
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
import {SlashIcon} from "lucide-react";
import {DataTableSelections} from "@/components/data-table/data-table-selections";

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
	exportProps?: {
		exportFileName: string;
		excludeColumns?: string[];
		onUserExport?: (data: T[])=> void;
	};
	actionProps?: {
		onDelete?: (rows: T[])=> void;
		onUserExport?: (rows: T[])=> void;
	}
}

export function AdvancedDataTable<T>(props:IAdvancedDataTable<T>) {
	const {
		columns,
		data
	} = props;
	const {isSelecting, setExportConfig} = useDataTableStore(state => ({
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
	const [internalColumns, setInternalColumns] = useState<ColumnDef<T>[]>([]);
	const [globalFilter, setGlobalFilter] = useState("")
	const [rowSelection, setRowSelection] = useState({})

	useEffect(()=>{
		if (isSelecting) {
			setInternalColumns(columns);
		} else {
			setInternalColumns(columns.filter(item=> item.id !== "select"));
		}
	},[columns, isSelecting]);

	useEffect(()=>{
		if (props.exportProps) {
			setExportConfig(props.exportProps?.exportFileName ?? "", props.exportProps?.excludeColumns ?? []);
		}
	},[props.exportProps]);

	const table = useReactTable({
		data,
		columns: internalColumns,
		state: {
			columnFilters,
			columnOrder,
			columnVisibility,
			columnPinning,
			globalFilter,
			rowSelection
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: "fuzzy",
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelection,
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
	const isRowSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
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
						{
							props?.exportProps && (
								<DataTableExport
									table={table}
									onUserExport={props.exportProps.onUserExport}
								/>
							)
						}
						<SlashIcon className={"w-4 h-4 text-slate-500"}/>
						<DataTableSelections table={table}/>
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
			{(isFiltered || isRowSelected) && (
				<DataTableFloatingBar<T>
					onUserExport={props.actionProps?.onUserExport}
					onDelete={props.actionProps?.onDelete}
					table={table}/>
			)}
		</DndContext>
	)
}