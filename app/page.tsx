"use client";

import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {ColumnDef, Table} from '@tanstack/react-table';
import {makeData, Person, simulateFetch} from "@/lib/makeData";
import {isWithinInterval} from "date-fns";
import {AdvancedDataTable} from "@/components/data-table";
import {DataTableCheckBox} from "@/components/data-table/data-table-checkbox";

const data = makeData(100_000);
export default function Home() {
	const [isLoading, setLoading] = useState(true);
	const filename = "exampleExport";
	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{
				id: 'select',
				header: ({ table }: { table: Table<Person> }) => (
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

	useEffect(()=>{
		const tmo = setTimeout(()=>{
			setLoading(false);
			clearTimeout(tmo);
		},5000);
	},[]);

	return (
		<AdvancedDataTable<Person>
			id={"example-advance-table"}
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
			onRowClick={(prop)=>{
				console.log(prop);
			}}
			contextMenuProps={{
				enableEdit: true,
				enableDelete: true,
				extra: {
					"Copy to clipboard": (data)=> {
						console.log("are we here?",data);
					}
				}
			}}
			isLoading={isLoading}
		/>
	);
}