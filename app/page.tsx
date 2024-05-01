"use client";
import * as React from "react";
import {getColumns} from "@/lib/columns";
import {
	DataTableCreateRowProps,
	DataTableDeleteRowProps,
	DataTableFilterField
} from "@/components/data-table/interface";
import {useDataTable} from "@/hooks/useDataTable";
import {useDataTableProvider} from "@/components/data-table/tools/data-table-provider";
import AdvanceDataTable from "@/components/data-table/AdvanceDataTable";
import type {Row, Table} from "@tanstack/react-table";
import {ReactNode} from "react";

export default function Home() {
	const {featureFlags} = useDataTableProvider();
	const columns = getColumns();
	const filterFields: DataTableFilterField<DataType>[] = [
		{
			label: "Name",
			value: "Name",
			placeholder: "Filter names...",
		},
		{
			label: "Remark",
			value: "Remark"
		},
		{
			label: "IsDefault",
			value: "IsDefault",
			options: [
				{
					label: "Yes",
					value: "Yes",
					withCount: true,
				},
				{
					label: "No",
					value: "No",
					withCount: true,
				}
			],
		},
	]
	const data = new Array(100).fill(0).map((it,id)=>({
		Name: `${id} - Name`,
		Remark: `${id} - Remark`,
		IsDefault: id % 2 === 0 ? "Yes" : "No"
	}));
	const pageCount = Math.ceil(data.length / 20);

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		// optional props
		filterFields,
		enableAdvancedFilter: featureFlags.includes("advancedFilter"),
		defaultPerPage: 20,
		defaultSort: "Name.asc",
	})

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<AdvanceDataTable
				table={table}
				filterFields={filterFields}
				floatingBarProps={{
					onExport: (table: Table<DataType>) => {},
					onDelete: (table: Table<DataType>,rows: Row<DataType>[]) => {},
					actions: []
				}}
				toolBarProps={{
					deleteProps: {
						buttonTitle: "Delete",
						title: "To Delete",
						description: "How to delete?",
						children: null
					},
					createProps: {
						title: "Create",
						description: "To create",
						buttonTitle: "Create Now",
						children: null,
					},
					onExport: (table: Table<DataType>) => {},
					exportTitle: "Export"
				}}/>
		</main>
	);
}
