import {Checkbox} from "@/components/ui/checkbox";
import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";

export function getColumns(): ColumnDef<DataType>[] {
	return [
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
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => <div className="w-20">{row.getValue("Name")}</div>,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "Remark",
			header: ({column}) => (
				<DataTableColumnHeader column={column} title="Remark"/>
			),
			cell: ({row}) => <div className="w-20">{row.getValue("Remark")}</div>,
		},
		{
			accessorKey: "IsDefault",
			header: ({column }) => (
				<DataTableColumnHeader column={column} title="IsDefault" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex w-[6.25rem] items-center">
						<span className="capitalize">{row.getValue("IsDefault")}</span>
					</div>
				)
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id))
			},
		}
	]
}
