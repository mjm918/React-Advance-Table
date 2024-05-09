"use client";

import {TableBody, TableCell, TableRow} from "@/components/ui/table";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {DataTableCell} from "@/components/data-table/data-table-cell";
import * as React from "react";
import {IDataTableBody} from "@/interface/IDataTable";
import {Row} from "@tanstack/table-core";

export function DataTableBody<T>(props: IDataTableBody<T>) {
	const {table, virtualColumns, columnOrder, rowVirtualizer, virtualPaddingRight, virtualPaddingLeft} = props;
	const virtualRows = rowVirtualizer.getVirtualItems();
	const {rows} = table.getRowModel();
	return (
		<TableBody
			style={{
				display: "grid",
				height: `${rowVirtualizer.getTotalSize()}px`,
				position: "relative",
			}}>
			{virtualRows.map(virtualRow => {
				const row = rows[virtualRow.index] as Row<T>;
				const visibleCells = row.getVisibleCells();

				return (
					<TableRow onClick={() => props.onClick && props.onClick(row.original)} key={row.id}
							  className={props.onClick ? "cursor-pointer" : ""}
							  data-index={virtualRow.index} //needed for dynamic row height measurement
							  ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
							  style={{
								  display: "flex",
								  position: "absolute",
								  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
								  width: "100%",
							  }}
					>
						{virtualPaddingLeft ? (
							<TableCell
								style={{display: "flex", width: virtualPaddingLeft}}
							/>
						) : null}
						{virtualColumns.map(vc => {
							const cell = visibleCells[vc.index];
							return (
								<SortableContext
									key={cell.id}
									items={columnOrder}
									strategy={horizontalListSortingStrategy}>
									<DataTableCell onEdit={() => console.log("edit")} cell={cell} key={cell.id}/>
								</SortableContext>
							);
						})}
						{virtualPaddingRight ? (
							<TableCell
								style={{display: "flex", width: virtualPaddingRight}}
							/>
						) : null}
					</TableRow>
				);
			})}
		</TableBody>
	);
}
