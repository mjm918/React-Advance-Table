"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {ColumnDef} from '@tanstack/react-table';
import {makeData, Person} from "@/lib/makeData";
import {isWithinInterval} from "date-fns";
import {AdvancedDataTable} from "@/components/data-table";

export default function Home() {
	const filename = "exampleExport";
	const [data, setData] = useState<Person[]>(() => makeData(5_000))
	const columns = useMemo<ColumnDef<Person, any>[]>(
		() => [
			{
				header: "First Name",
				accessorKey: 'firstName',
				id: 'firstName',
				cell: info => info.getValue(),
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
		<AdvancedDataTable columns={columns} data={data} exportFileName={filename}/>
	);
}