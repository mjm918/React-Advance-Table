"use client";
import * as React from "react";
import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/data-table/data-table";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Checkbox} from "@/components/ui/checkbox";

export default function Home() {
	const columns = useMemo<ColumnDef<DataType>[]>(()=>[
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "Name",
			header: (p)=> <DataTableColumnHeader column={p.column} title={"Name"}/>,
			cell: info => info.getValue(),
			filterFn: "equalsString"
		},
		{
			accessorKey: "Remark",
			header: (p)=> <DataTableColumnHeader column={p.column} title={"Remark"}/>,
			cell: info => info.getValue(),
		},
		{
			header: (p)=> <DataTableColumnHeader column={p.column} title={"Default Location?"}/>,
			accessorKey: "IsDefault",
			cell: info => <p>{info.getValue() ? "Yes" : "No"}</p>
		}
	],[]);
	const data = new Array(1000).fill(0).map((_it,index)=>({
		Name: `Name ${index}`,
		Remark: `Remark ${index}`,
		IsDefault: index % 2 === 0
	} as DataType));
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<DataTable
				searchableColumns={[
					{
						id: "Name",
						title: "Name"
					}
				]}
				filterableColumns={[
					{
						options: [
							{
								label: "Yes",
								value: "Yes"
							},
							{
								label: "No",
								value: "No"
							}
						],
						id: "IsDefault",
						title: "Is Default?"
					}
				]}
				columns={columns}
				data={data}/>
		</main>
	);
}
