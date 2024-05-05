"use client";

import {Cell, flexRender} from "@tanstack/react-table";
import {useSortable} from "@dnd-kit/sortable";
import * as React from "react";
import {CSSProperties} from "react";
import {CSS} from "@dnd-kit/utilities";
import {TableCell} from "@/components/ui/table";
import {getCommonPinningStyles} from "@/lib/columns";

export function DataTableCell<T>({cell}: { cell: Cell<T, unknown> }) {
	const { isDragging, setNodeRef, transform } = useSortable({
		id: cell.column.id,
	});
	const pinStyle = getCommonPinningStyles(cell.column);
	const combinedStyle: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: 'relative',
		transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
		transition: 'width transform 0.2s ease-in-out',
		width: cell.column.getSize(),
		zIndex: isDragging ? 1 : 0,
		...(pinStyle || {})
	};

	return (
		<TableCell style={combinedStyle} ref={setNodeRef}>
			{flexRender(
				cell.column.columnDef.cell,
				cell.getContext()
			)}
		</TableCell>
	);
}