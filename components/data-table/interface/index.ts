import * as React from "react";
import {ReactNode} from "react";
import {Dialog} from "@/components/ui/dialog";
import type {Column, Row, Table} from "@tanstack/react-table";
import {type Table as TanstackTable} from "@tanstack/react-table"
import type {DataTableConfig} from "@/config/data-table";
import {Sheet} from "@/components/ui/sheet";

export type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"]

export interface Option {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	withCount?: boolean
}

export interface DataTableFilterField<TData> {
	label: string
	value: keyof TData
	placeholder?: string
	options?: Option[]
}

export interface DataTableFilterOption<TData> {
	id: string
	label: string
	value: keyof TData
	options: Option[]
	filterValues?: string[]
	filterOperator?: string
	isMulti?: boolean
}

export interface DataTableDeleteRowProps<T>
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	rows: Row<T>[]
	buttonTitle: string
	title: string
	description: string
	children: ReactNode
	showDeleteTrigger?: boolean
}

export interface DataTableCreateRowProps<T> {
	title: string
	description: string
	buttonTitle: string
	children: ReactNode
}

export interface DataTableFloatingBarProps<T> {
	table: Table<T>
	onExport: (table: Table<T>) => void
	onDelete: (table: Table<T>,rows: Row<T>[]) => void
	actions: ReactNode[]
}

export interface DataTableContextProps {
	featureFlags: FeatureFlagValue[]
	setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>
}

export interface DataTableProps<TData> {
	/**
	 * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
	 * @type TanstackTable<TData>
	 */
	table: TanstackTable<TData>

	/**
	 * The floating bar to render at the bottom of the table on row selection.
	 * @default null
	 * @type React.ReactNode | null
	 * @example floatingBar={<TasksTableFloatingBar table={table} />}
	 */
	floatingBar?: React.ReactNode | null
}

export interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>
	title?: string
	options: Option[]
}

export interface DataTablePaginationProps<TData> {
	table: Table<TData>
	pageSizeOptions?: number[]
}

export interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The number of columns in the table.
	 * @type number
	 */
	columnCount: number

	/**
	 * The number of rows in the table.
	 * @default 10
	 * @type number | undefined
	 */
	rowCount?: number

	/**
	 * The number of searchable columns in the table.
	 * @default 0
	 * @type number | undefined
	 */
	searchableColumnCount?: number

	/**
	 * The number of filterable columns in the table.
	 * @default 0
	 * @type number | undefined
	 */
	filterableColumnCount?: number

	/**
	 * Flag to show the table view options.
	 * @default undefined
	 * @type boolean | undefined
	 */
	showViewOptions?: boolean

	/**
	 * The width of each cell in the table.
	 * The length of the array should be equal to the columnCount.
	 * Any valid CSS width value is accepted.
	 * @default ["auto"]
	 * @type string[] | undefined
	 */
	cellWidths?: string[]

	/**
	 * Flag to show the pagination bar.
	 * @default true
	 * @type boolean | undefined
	 */
	withPagination?: boolean

	/**
	 * Flag to prevent the table cells from shrinking.
	 * @default false
	 * @type boolean | undefined
	 */
	shrinkZero?: boolean
}

export interface DataTableToolbarProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

export interface DataTableViewOptionsProps<TData> {
	table: Table<TData>
}

export interface DataTableToolbarActionsProps<T> {
	table: Table<T>
	deleteProps: Omit<DataTableDeleteRowProps<T>,"rows">
	createProps: DataTableCreateRowProps<T>
	onExport: (table: Table<T>) => void
	exportTitle: string
}

export interface DataTableUpdateRowSheetProps<T>
	extends React.ComponentPropsWithRef<typeof Sheet> {
	data: T
	title: string
	description: string
	children: ReactNode
}

export interface DataTableFilterItemProps<TData> {
	table: Table<TData>
	selectedOption: DataTableFilterOption<TData>
	selectedOptions: DataTableFilterOption<TData>[]
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
	defaultOpen: boolean
}

export interface DataTableAdvancedFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>
	title?: string
	options: Option[]
	selectedValues: Set<string>
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
}

export interface DataTableAdvancedToolbarProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

export interface DataTableFilterComboboxProps<TData> {
	options: DataTableFilterOption<TData>[]
	selectedOptions: DataTableFilterOption<TData>[]
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
	onSelect: () => void
	children?: React.ReactNode
}

export interface DataTableMultiFilterProps<TData> {
	table: Table<TData>
	allOptions: DataTableFilterOption<TData>[]
	options: DataTableFilterOption<TData>[]
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
	defaultOpen: boolean
}

export interface MultiFilterRowProps<TData> {
	i: number
	table: Table<TData>
	allOptions: DataTableFilterOption<TData>[]
	option: DataTableFilterOption<TData>
	options: DataTableFilterOption<TData>[]
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
	operator?: DataTableConfig["logicalOperators"][number]
	setOperator: React.Dispatch<
		React.SetStateAction<
			DataTableConfig["logicalOperators"][number] | undefined
		>
	>
}

export interface AdvanceDataTableProps<T> {
	table: Table<T>
	filterFields: DataTableFilterField<T>[]
	floatingBarProps: Omit<DataTableFloatingBarProps<T>, "table">
	toolBarProps: Omit<DataTableToolbarActionsProps<T>, "table">
}
