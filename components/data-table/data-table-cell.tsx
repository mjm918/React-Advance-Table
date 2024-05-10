"use client";

import {flexRender} from "@tanstack/react-table";
import {useSortable} from "@dnd-kit/sortable";
import * as React from "react";
import {CSSProperties} from "react";
import {CSS} from "@dnd-kit/utilities";
import {TableCell} from "@/components/ui/table";
import {getCommonPinningStyles} from "@/lib/columns";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem, ContextMenuNotItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger
} from "@/components/ui/context-menu";
import _ from "lodash";
import {useDataTableStore} from "@/store/dataTableStore";
import ReactHotkeys from "react-hot-keys";
import {IDataTableCellEdit} from "@/interface/IDataTable";
import {DataTableEditRow} from "@/components/data-table/data-table-edit-row";
import {RequestDeleteConfirmation} from "@/components/data-table/data-table-delete-confirmation";

export function DataTableCell<T>({cell}: IDataTableCellEdit<T>) {
    const {isDragging, setNodeRef, transform} = useSortable({
        id: cell.column.id,
    });
    const {contextMenuProps, isSelecting} = useDataTableStore(state => ({...state}));
    const pinStyle = getCommonPinningStyles(cell.column);
    const combinedStyle: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition: "width transform 0.2s ease-in-out",
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
        ...(pinStyle || {}),
        alignContent: "center"
    };
    const onContextMenuItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, handler?: (probably: T) => void) => {
        event.stopPropagation();
        handler && handler(cell.row.original);
    };
    const showContextMenu = isSelecting !== true && contextMenuProps !== undefined;
    if (showContextMenu) {
        return (
            <TableCell style={combinedStyle} ref={setNodeRef}>
                <ContextMenu>
                    <ContextMenuTrigger className={"block"}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-36">
						{
							contextMenuProps.enableEdit && (
								<DataTableEditRow presetData={cell.row.original as {[k:string]: any;}}/>
							)
						}
                        {
                            !_.isEmpty(contextMenuProps?.extra) && (
                                <ContextMenuSeparator/>
                            )
                        }
                        {
                            !_.isEmpty(contextMenuProps?.extra) && (
                                <ContextMenuSub>
                                    <ContextMenuSubTrigger>
                                        More Tools
                                    </ContextMenuSubTrigger>
                                    <ContextMenuSubContent className="w-48">
                                        {
                                            Object.keys(contextMenuProps?.extra).map((name, index) =>
                                                <ContextMenuItem
                                                    // @ts-ignore
                                                    onClick={event => onContextMenuItemClick(event, contextMenuProps.extra[name], true)}
                                                    key={"Sub-data-table-context-menu-item-".concat(index.toString())}>
                                                    {name}
                                                </ContextMenuItem>)
                                        }
                                    </ContextMenuSubContent>
                                </ContextMenuSub>
                            )
                        }
                        {
                            contextMenuProps.enableDelete && (
                                <ContextMenuSeparator/>
                            )
                        }
						{
							contextMenuProps.enableDelete && (
								<RequestDeleteConfirmation onConfirm={()=>contextMenuProps.onDelete(cell.row.original)} multiple={false}>
									<ContextMenuNotItem>
										<span className={"text-red-500"}>Delete Row</span>
									</ContextMenuNotItem>
								</RequestDeleteConfirmation>
							)
						}
					</ContextMenuContent>
                </ContextMenu>
            </TableCell>
        );
    }
    return (
        <TableCell style={combinedStyle} ref={setNodeRef}>
            {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
            )}
        </TableCell>
    );
}
