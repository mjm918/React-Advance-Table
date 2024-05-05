"use client";

import React from "react";
import {Table} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {DownloadIcon, TrashIcon, XIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function DataTableFloatingBar<T>({table}:{table: Table<T>}) {
	const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
	const onPressResetFilter = () => {
		table.resetColumnFilters();
		table.resetGlobalFilter();
	};
	const onDelete = () => {
		const rows = table.getRowModel().flatRows;
		console.log(rows.length);
	};
	return (
		<div className="fixed inset-x-0 bottom-4 z-50 w-full px-4">
			<div className="w-full overflow-x-auto">
				<div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
					<div className="flex h-7 items-center rounded-md border ">
						{
							isFiltered ?
								<Button onClick={onPressResetFilter} variant={"default"} size={"sm"} className={"h-8"}>
									<XIcon className={"w-4 h-4"}/>
									Clear Filters
								</Button>
								: null
						}
					</div>
					●
					<Tooltip>
						<TooltipTrigger>
							<Button onClick={onDelete} variant={"destructive"} size={"icon"} className={"h-8"}>
								<TrashIcon className={"w-4 h-4"}/>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Delete current rows</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<Button variant={"default"} size={"icon"} className={"h-8"}>
								<DownloadIcon className={"w-4 h-4"}/>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Export current rows</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}