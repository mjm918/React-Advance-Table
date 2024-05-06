import {Table} from "@tanstack/react-table";
import {TableBody, TableRow} from "@/components/ui/table";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {DataTableCell} from "@/components/data-table/data-table-cell";
import * as React from "react";

interface IDataTableBody<T> {
	table: Table<T>;
	columnOrder: string[];
	onClick?: (prop: T) => void;
}
export function DataTableBody<T>(props:IDataTableBody<T>) {
	const {table, columnOrder} = props;
	return (
		<TableBody>
			{table.getRowModel().rows.map(row => {
				return (
					<TableRow onClick={()=>props.onClick && props.onClick(row.original)} key={row.id} className={props.onClick ? "cursor-pointer" : ""}>
						{row.getVisibleCells().map(cell => {
							return (
								<SortableContext
									key={cell.id}
									items={columnOrder}
									strategy={horizontalListSortingStrategy}>
									<DataTableCell onEdit={()=>console.log("edit")} cell={cell} key={cell.id}/>
								</SortableContext>
							)
						})}
					</TableRow>
				)
			})}
		</TableBody>
	);
}
