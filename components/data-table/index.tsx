"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	PaginationState,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table";
import {useDataTableStore} from "@/store/dataTableStore";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
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
import {TDataTableContextMenuProps, TDataTableExportProps} from "@/@types";
import {
	keepPreviousData,
	useQuery,
} from "@tanstack/react-query";
import _ from "lodash";

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

export type TAdvancedDataTableDataProps<T> = {
	rowCount: number;
	pageCount: number;
	rows: T[]
}

export interface IAdvancedDataTable<T> {
	id: string;
	columns: ColumnDef<T>[];
	onFetch: (page: PaginationState)=> Promise<TAdvancedDataTableDataProps<T>>;
	exportProps?: TDataTableExportProps;
	actionProps?: {
		onDelete?: (rows: T[])=> void;
		onUserExport?: (rows: T[])=> void;
	};
	contextMenuProps?: TDataTableContextMenuProps;
	onRowClick?: (prop: T) => void;
}

export function AdvancedDataTable<T>(props:IAdvancedDataTable<T>) {
	const {
		columns,
		onFetch,
		id
	} = props;
	if (_.isEmpty(id.trim())) {
		throw new Error("AdvancedDataTable required field missing `id`. Must be an unique identifier");
	}
	const {isSelecting, setExtraProps} = useDataTableStore(state => ({
		...state
	}));
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 100,
	})
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
		setExtraProps(props.exportProps, props.contextMenuProps);
	},[props]);

	const { data, isFetching, status } = useQuery({
		queryKey: [id, pagination],
		queryFn: () => onFetch(pagination),
		placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
	})
	const defaultData = useMemo(() => [], [])

	const table = useReactTable({
		data: data?.rows ?? defaultData,
		rowCount: data?.rowCount,
		columns: internalColumns,
		state: {
			columnFilters,
			columnOrder,
			columnVisibility,
			columnPinning,
			globalFilter,
			rowSelection,
			pagination
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: "fuzzy",
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnPinningChange: setColumnPinning,
		onColumnOrderChange: setColumnOrder,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client-side filtering
		getSortedRowModel: getSortedRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(), // client-side faceting
		getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
		getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
		manualPagination: true,
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
			<div className="p-2 rounded bg-white mb-12">
				<div className={"flex flex-row items-center justify-between"}>
					<div className={"flex flex-row items-center"}>
						<DataTableInput
							value={globalFilter ?? ''}
							onChange={value => setGlobalFilter(String(value))}
							className="p-2 font-lg shadow border border-block"
							placeholder="Filter anything..."
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
					<TableHeader className={"sticky top-0"}>
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
					<DataTableBody onClick={props?.onRowClick} table={table} columnOrder={columnOrder}/>
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