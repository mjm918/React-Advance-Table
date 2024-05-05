"use client";

import {Table} from "@tanstack/react-table";
import {utils, writeFile} from "xlsx";
import {DownloadIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export function DataTableExport<T>({table, filename, onUserExport}: {table:Table<T>; filename: string; onUserExport?: (data: T[])=> void;}) {
	const onPress = () => {
		const temp = table.options.data;
		const data: T[] = [];
		const columns = table.getAllColumns();
		const naming: { [k: string]: any } = {};
		for (let i = 0; i < columns.length; i++) {
			const col = columns[i];
			naming[col.id] = col.columnDef.header;
		}
		temp.forEach(item=>{
			const obj = item as {[K:string]: any};
			const tempObj: { [k: string]: any } = {};
			for (const objKey in obj) {
				if (Object.hasOwn(naming,objKey)) {
					tempObj[naming[objKey]] = obj[objKey];
				}
			}
			data.push(tempObj as T);
		});
		if (onUserExport) {
			onUserExport(data);
		} else {
			try {
				const wb = utils.book_new();
				const ws = utils.json_to_sheet(data);
				utils.book_append_sheet(wb, ws, "Exported");
				writeFile(wb, filename.concat(".xlsx"));
			} catch (ex: any) {
				alert(ex.message);
			}
		}
	};

	return (
		<Button
			onClick={onPress}
			aria-label="Toggle columns"
			variant="ghost"
			size="sm"
			className="ml-auto hidden h-8 lg:flex text-slate-500">
			<DownloadIcon className="mr-2 size-4" />
			Export
		</Button>
	);
}