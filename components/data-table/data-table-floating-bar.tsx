"use client";

import React, {ReactNode, useState} from "react";
import {Row, Table} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {DownloadIcon, ListXIcon, TrashIcon, XIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel,
	AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {exportExcel, exportExcelData} from "@/lib/exportExcel";
import {useDataTableStore} from "@/store/dataTableStore";

interface IDataTableFloatingBar<T> {
	table: Table<T>;
	onUserExport?: (rows: T[]) => void;
	onDelete?: (rows: T[]) => void;
}

export function DataTableFloatingBar<T>({table, onUserExport, onDelete}:IDataTableFloatingBar<T>) {
	const {exportFilename, exportExcludeColumns} = useDataTableStore(state => ({...state}));
	const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
	const isRowSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

	const onPressResetFilter = () => {
		table.resetColumnFilters();
		table.resetGlobalFilter();
	};
	const onDeleteInner = () => {
		const rows = table.getSelectedRowModel().rows.map(item=>item.original);
		onDelete && onDelete(rows);
	};
	const onExport = () => {
		const rows = table.getSelectedRowModel().rows.map(item=>item.original);
		if (onUserExport) {
			const data = exportExcelData(rows, table.getAllColumns(), exportExcludeColumns);
			onUserExport(data);
		} else {
			exportExcel(rows, exportFilename);
		}
	};

	return (
		<div className="fixed inset-x-0 bottom-4 z-50 w-full px-4">
			<div className="w-full overflow-x-auto">
				<div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
					<div className="flex h-7 items-center rounded-md border ">
						{
							isFiltered ?
								<Button onClick={onPressResetFilter} variant={"default"} size={"sm"} className={"h-8"}>
									<XIcon className={"w-4 h-4 mr-1"}/>
									Clear Filters
								</Button>
								: null
						}
						{
							isRowSelected ?
								<Button onClick={()=>table.resetRowSelection()} variant={"default"} size={"sm"} className={"h-8"}>
									<ListXIcon className={"w-4 h-4 mr-1"}/>
									Clear Selection
								</Button>
								: null
						}
					</div>
					{isRowSelected && (onUserExport !== undefined || onDelete !== undefined) ? "●" : ""}
					{
						isRowSelected && onDelete !== undefined ?
							<Tooltip>
								<TooltipTrigger>
									<RequestDeleteConfirmation onConfirm={onDeleteInner}>
										<Button variant={"destructive"} size={"icon"} className={"h-8"}>
											<TrashIcon className={"w-4 h-4"}/>
										</Button>
									</RequestDeleteConfirmation>
								</TooltipTrigger>
								<TooltipContent>
									<p>Delete current rows</p>
								</TooltipContent>
							</Tooltip> : null
					}
					{
						isRowSelected  ?
							<Tooltip>
								<TooltipTrigger>
									<Button onClick={onExport} variant={"default"} size={"icon"} className={"h-8"}>
										<DownloadIcon className={"w-4 h-4"}/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Export current rows</p>
								</TooltipContent>
							</Tooltip> : null
					}
				</div>
			</div>
		</div>
	);
}

function RequestDeleteConfirmation({children, onConfirm}:{children: ReactNode;onConfirm:()=>void}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>This will permanently delete all selected rows. Are you sure you want to proceed?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete all selected rows? You won't be able to undo this action.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}