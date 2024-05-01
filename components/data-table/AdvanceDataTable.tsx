"use client"

import {useDataTableProvider} from "@/components/data-table/tools/data-table-provider";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbarActions} from "@/components/data-table/tools/data-table-toolbar-actions";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import {DataTable} from "@/components/data-table/data-table";
import {DataTableFloatingBar} from "@/components/data-table/tools/data-table-floating-bar";
import {
	AdvanceDataTableProps
} from "@/components/data-table/interface";

export default function AdvanceDataTable<T>({ table, filterFields, floatingBarProps, toolBarProps }: AdvanceDataTableProps<T>) {
	const { featureFlags } = useDataTableProvider();
	return (
		<div className="w-full space-y-2.5 overflow-auto">
			{featureFlags.includes("advancedFilter") ? (
				<DataTableAdvancedToolbar table={table} filterFields={filterFields}>
					<DataTableToolbarActions table={table} {...toolBarProps}/>
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<DataTableToolbarActions table={table} {...toolBarProps}/>
				</DataTableToolbar>
			)}
			<DataTable
				table={table}
				floatingBar={
					featureFlags.includes("floatingBar") ? (
						<DataTableFloatingBar table={table} {...floatingBarProps}/>
					) : null
				}
			/>
		</div>
	);
}