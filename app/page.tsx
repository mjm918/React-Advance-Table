"use client";

import * as React from "react";
import {HTMLProps, useMemo, useState} from "react";
import {ColumnDef} from '@tanstack/react-table';
import {makeData, Person} from "@/lib/makeData";
import {isWithinInterval} from "date-fns";
import {AdvancedDataTable} from "@/components/data-table";
import {DataTableCheckBox} from "@/components/data-table/data-table-checkbox";

export default function Home() {
	const filename = "exampleExport";
	const [data, setData] = useState<Person[]>(() => makeData(5_000))
	const columns = useMemo<ColumnDef<Person, any>[]>(
		() => [
			{
				id: 'select',
				header: ({ table }) => (
					<DataTableCheckBox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate: table.getIsSomeRowsSelected(),
							onChange: table.getToggleAllRowsSelectedHandler(),
						}}
					/>
				),
				cell: ({ row }) => (
					<DataTableCheckBox
						{...{
							checked: row.getIsSelected(),
							disabled: !row.getCanSelect(),
							indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/>
				),
				size: 20
			},
			{
				header: "First Name",
				accessorKey: 'firstName',
				id: 'firstName',
				cell: info => info.getValue()
			},
			{
				accessorFn: row => row.lastName,
				id: 'lastName',
				cell: info => info.getValue(),
				header: "Last Name",
			},
			{
				accessorKey: 'age',
				id: 'age',
				header: "Age",
				meta: {
					filterVariant: 'range',
				},
			},
			{
				accessorKey: 'visits',
				id: 'visits',
				header: "Visits",
				meta: {
					filterVariant: 'range',
				},
			},
			{
				accessorKey: 'lastUpdate',
				id: 'lastUpdate',
				header: "Last Update",
				cell: info => {
					const str = info.getValue() as Date;
					return str.toLocaleDateString();
				},
				meta: {
					filterVariant: 'date',
				},
				filterFn: (row, columnId, filterValue) => {
					const columnDate = row.getValue(columnId) as Date;
					const {from, to} = filterValue;
					return isWithinInterval(columnDate,{ start: from, end: to || from });
				}
			},
			{
				accessorKey: 'status',
				id: 'status',
				header: "Status",
				meta: {
					filterVariant: 'select',
				},
			}
		],
		[]
	)

	return (
		<AdvancedDataTable<Person>
			columns={columns}
			data={data}
			exportProps={{
				exportFileName: filename
			}}
			actionProps={{
				onDelete:(props)=> {
					console.log(props);
				}
			}}
		/>
	);
}