import {Table} from "@tanstack/react-table";
import {TableBody, TableRow} from "@/components/ui/table";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {DataTableCell} from "@/components/data-table/data-table-cell";
import * as React from "react";

export function DataTableBody<T>({table, columnOrder}:{table: Table<T>; columnOrder: string[]}) {
	return (
		<TableBody>
			{table.getRowModel().rows.map(row => {
				return (
					<TableRow key={row.id}>
						{row.getVisibleCells().map(cell => {
							return (
								<SortableContext
									key={cell.id}
									items={columnOrder}
									strategy={horizontalListSortingStrategy}>
									<DataTableCell cell={cell} key={cell.id}/>
								</SortableContext>
							)
						})}
					</TableRow>
				)
			})}
		</TableBody>
	);
}
