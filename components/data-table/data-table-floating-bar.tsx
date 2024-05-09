"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {DownloadIcon, ListXIcon, TrashIcon, XIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {exportExcel, exportExcelData} from "@/lib/exportExcel";
import {useDataTableStore} from "@/store/dataTableStore";
import {IDataTableFloatingBar} from "@/interface/IDataTable";
import {format, parseISO} from "date-fns";
import {RequestDeleteConfirmation} from "@/components/data-table/data-table-delete-confirmation";

export function DataTableFloatingBar<T>({table, onUserExport, onDelete}:IDataTableFloatingBar<T>) {
    const {exportProps} = useDataTableStore(state => ({...state}));
    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
    const isRowSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
    const naming: { [k: string]: any } = {};
    for (let i = 0; i < table.options.columns.length; i++) {
        const col = table.options.columns[i];
        naming[col.id as string] = col.header as string;
    }

    const currentFilters = table.getState().columnFilters.map((item: any, _index: number)=>{
        const fieldName = naming[item.id];
        if (item.value instanceof Array) {
            item.value = item.value.map((ii: any, _idx: number)=> !ii ? "♾️" : ii);
            // range filter
            return {
                columnId: item.id,
                filter: `${fieldName} In Range Of ( ${item.value.join(" - ")} )`
            };
        }
        if (typeof item.value === "string") {
            // either search string or select
            return {
                columnId: item.id,
                filter: `${fieldName} Equals/Contains '${item.value}'`
            };
        }
        if (typeof item.value === "object" && item.value !== null && !(item.value instanceof Array)) {
            if (Object.keys(item.value).includes("from")) {
                // datetime
                if (typeof item.value.from === "string") {
                    item.value.from = format(parseISO(item.value.from),"yyyy/MM/dd");
                    item.value.to = format(parseISO(item.value.to),"yyyy/MM/dd");
                } else {
                    item.value.from = format(item.value.from,"yyyy/MM/dd");
                    item.value.to = format(item.value.to,"yyyy/MM/dd");
                }
                return {
                    columnId: item.id,
                    filter: `${fieldName} Is Between ( ${item.value.from} - ${item.value.to} )`
                };
            }
        }
        return item;
    });
    const onRemoveColumnFilter = (columnId: string) => {
        table.setColumnFilters(table.getState().columnFilters.filter(item=>item.id !== columnId));
    };
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
        const data = exportExcelData(rows, table.getAllColumns(), exportProps?.excludeColumns ?? []);
        if (onUserExport) {
            onUserExport(data);
        } else {
            exportExcel(data, exportProps?.exportFileName ?? "");
        }
    };

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 w-full px-4">
            <div className="w-full overflow-x-auto space-y-2">
                {
                    isFiltered && (
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
                            <div className="flex h-7 items-center rounded-md border ">
                                <Button onClick={onPressResetFilter} variant={"default"} size={"sm"}
                                    className={"h-8"}>
                                    <XIcon className={"w-4 h-4 mr-1"}/>
                                    Clear Filters
                                </Button>
                            </div>
                            {currentFilters.length > 0 ? "●" : ""}
                            {
                                currentFilters.length > 0 && currentFilters.map((f: { columnId: string; filter: string; }, index: number) =>
                                    <Button onClick={()=>onRemoveColumnFilter(f.columnId)} key={String(index).concat("--filter")} variant={"outline"} size={"sm"}
                                        className={"h-8"}>
                                        <XIcon className={"w-4 h-4 mr-1"}/>
                                        {f.filter}
                                    </Button>
                                )
                            }
                        </div>
                    )
                }
                {
                    isRowSelected && (
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
                            <div className="flex h-7 items-center rounded-md border ">
                                <Button onClick={() => table.resetRowSelection()} variant={"default"} size={"sm"}
                                    className={"h-8"}>
                                    <ListXIcon className={"w-4 h-4 mr-1"}/>
                                    Clear Selection
                                </Button>
                            </div>
                            ●
                            {
                                isRowSelected && onDelete !== undefined ?
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <RequestDeleteConfirmation multiple={true} onConfirm={onDeleteInner}>
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
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button onClick={onExport} variant={"default"} size={"icon"} className={"h-8"}>
                                        <DownloadIcon className={"w-4 h-4"}/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Export current rows</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )
                }
            </div>
        </div>
    );
}