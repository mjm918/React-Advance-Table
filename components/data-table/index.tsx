"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {useDataTableStore} from "@/store/dataTableStore";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {fuzzyFilter} from "@/lib/utils";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {DataTableInput} from "@/components/data-table/data-table-input";
import {DataTableExport} from "@/components/data-table/data-table-export";
import {DataTableColumnVisibility} from "@/components/data-table/data-table-column-visibility";
import {Table, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DataTableHeader} from "@/components/data-table/data-table-header";
import {DataTableBody} from "@/components/data-table/data-table-body";
import {DataTablePagination} from "@/components/data-table/data-table-pagination";
import {DataTableFloatingBar} from "@/components/data-table/data-table-floating-bar";
import {FilterFn} from "@tanstack/table-core";
import {RankingInfo} from "@tanstack/match-sorter-utils";
import {SlashIcon} from "lucide-react";
import {DataTableSelections} from "@/components/data-table/data-table-selections";
import _ from "lodash";
import {IAdvancedDataTable} from "@/interface/IDataTable";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import {DataTableAddRow} from "@/components/data-table/data-table-add-row";
import {useVirtualizer} from "@tanstack/react-virtual";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> {
		filterVariant?: "text" | "range" | "select" | "date";
	}
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}

export function AdvancedDataTable<T>(props:IAdvancedDataTable<T>) {
    const {
        columns,
        data,
        id
    } = props;
    if (_.isEmpty(id.trim())) {
        throw new Error("AdvancedDataTable required field missing `id`. Must be an unique identifier");
    }
    const {isSelecting, setExtraProps} = useDataTableStore(state => ({
        ...state
    }));
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({});
    const [columnPinning, setColumnPinning] = useState({});
    const [columnOrder, setColumnOrder] = useState<string[]>(() =>
        columns.map(c => c.id!)
    );
    const [internalColumns, setInternalColumns] = useState<ColumnDef<T>[]>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});

    useEffect(()=>{
        if (isSelecting) {
            setInternalColumns(columns);
        } else {
            setInternalColumns(columns.filter(item=> item.id !== "select").map(item=>({...item,size: 200})));
        }
    },[columns, isSelecting]);

    useEffect(()=>{
        setExtraProps(
            props?.exportProps,
            props?.contextMenuProps,
            props?.addDataProps,
            props?.editDataProps,
            props?.dataValidationProps
        );
    },[props]);

    const table = useReactTable({
        data: data,
        columns: internalColumns,
        state: {
            columnFilters,
            columnOrder,
            columnVisibility,
            columnPinning,
            globalFilter,
            rowSelection
        },
        filterFns: {
            fuzzy: fuzzyFilter
        },
        globalFilterFn: "fuzzy",
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onColumnOrderChange: setColumnOrder,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client-side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(), // client-side faceting
        getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
        getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    });

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
            });
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
    const isRowSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const visibleColumns = table.getVisibleLeafColumns();
    const columnVirtualizer = useVirtualizer({
        count: visibleColumns.length,
        estimateSize: index => visibleColumns[index].getSize(),
        getScrollElement: () => tableContainerRef.current,
        horizontal: true,
    });
    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => 33,
        getScrollElement: () => tableContainerRef.current,
        measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
			    ? element => element?.getBoundingClientRect().height
			    : undefined,
        overscan: 100,
    });
    const virtualColumns = columnVirtualizer.getVirtualItems();
    let virtualPaddingLeft: number | undefined;
    let virtualPaddingRight: number | undefined;

    if (columnVirtualizer && virtualColumns?.length) {
        virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
        virtualPaddingRight =
			columnVirtualizer.getTotalSize() -
			(virtualColumns[virtualColumns.length - 1]?.end ?? 0);
    }

    if (props?.isLoading) {
        return (
            <DataTableSkeleton
                columnCount={5}/>
        );
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            sensors={sensors}>
            <div className="rounded bg-white mb-12">
                <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row items-center"}>
                        <DataTableInput
                            value={globalFilter ?? ""}
                            onChange={value => setGlobalFilter(String(value))}
                            className="p-2 font-lg border border-block"
                            placeholder="Filter anything..."
                        />
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <DataTableAddRow/>
                        <DataTableSelections table={table}/>
                        <DataTableColumnVisibility table={table}/>
                        <SlashIcon className={"w-4 h-4 text-slate-500"}/>
                        {
                            props?.exportProps && (
                                <DataTableExport
                                    table={table}
                                    onUserExport={props.exportProps.onUserExport}
                                />
                            )
                        }
                    </div>
                </div>
                <div
                    className={"border mt-2 rounded-lg p-1"}
                    ref={tableContainerRef}
                    style={{
                        overflow: "auto",
                        position: "relative",
                        height: "480px",
                    }}>
                    <Table style={{ display: "grid" }}>
                        <TableHeader
                            style={{
                                display: "grid",
                                position: "sticky",
                                top: "0px",
                                zIndex: 1,
                            }}>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow style={{ display: "flex", width: "100%" }} key={headerGroup.id}>
                                    {virtualPaddingLeft ? (
                                        <TableHead style={{ display: "flex", width: virtualPaddingLeft }} />
                                    ) : null}
                                    <SortableContext
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}>
                                        {virtualColumns.map(vc => {
                                            const header = headerGroup.headers[vc.index];
                                            return (
                                                <DataTableHeader key={header.id} header={header}/>
                                            );
                                        })}
                                    </SortableContext>
                                    {virtualPaddingRight ? (
                                        <TableHead style={{ display: "flex", width: virtualPaddingRight }} />
                                    ) : null}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <DataTableBody
                            virtualColumns={virtualColumns}
                            virtualPaddingLeft={virtualPaddingLeft}
                            virtualPaddingRight={virtualPaddingRight}
                            rowVirtualizer={rowVirtualizer}
                            onClick={props?.onRowClick}
                            table={table}
                            columnOrder={columnOrder}/>
                    </Table>
                </div>
                <div className="h-2"/>
                <DataTablePagination table={table}/>
            </div>
            {(isFiltered || isRowSelected) && (
                <DataTableFloatingBar<T>
                    onUserExport={props.actionProps?.onUserExport}
                    onDelete={props.actionProps?.onDelete}
                    table={table}/>
            )}
        </DndContext>
    );
}