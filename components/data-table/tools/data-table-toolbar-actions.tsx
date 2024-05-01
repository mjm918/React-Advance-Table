"use client"

import {DownloadIcon} from "@radix-ui/react-icons"
import {Row} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {DataTableDeleteRows} from "@/components/data-table/tools/data-table-delete-rows";
import {DataTableToolbarActionsProps} from "@/components/data-table/interface";
import {DataTableCreateRow} from "@/components/data-table/tools/data-table-create-row";

export function DataTableToolbarActions<T>(props: DataTableToolbarActionsProps<T>) {
	const {table, onExport, exportTitle} = props;
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DataTableDeleteRows<T>
					rows={table.getFilteredSelectedRowModel().rows as Row<T>[]}
					{...props.deleteProps}
				/>
			) : null}
			<DataTableCreateRow {...props.createProps} />
			<Button
				variant="outline"
				size="sm"
				onClick={() =>onExport(table)}
			>
				<DownloadIcon className="mr-2 size-4" aria-hidden="true" />
				{exportTitle}
			</Button>
		</div>
	)
}
