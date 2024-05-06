"use client";

import {Table} from "@tanstack/react-table";
import {utils, writeFile} from "xlsx";
import {DownloadIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDataTableStore} from "@/store/dataTableStore";
import {exportExcel, exportExcelData} from "@/lib/exportExcel";

interface IDataTableExport<T> {
	table:Table<T>;
	onUserExport?: (data: T[])=> void;
}

export function DataTableExport<T>({table, onUserExport}: IDataTableExport<T>) {
	const {exportProps} = useDataTableStore(state => ({...state}));
	const onPress = () => {
		const data = exportExcelData(table.options.data, table.getAllColumns(), exportProps?.excludeColumns ?? []);
		if (onUserExport) {
			onUserExport(data);
		} else {
			exportExcel(data, exportProps?.exportFileName ?? "");
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