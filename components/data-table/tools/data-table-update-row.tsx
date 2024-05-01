"use client"

import * as React from "react"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import {DataTableUpdateRowSheetProps} from "@/components/data-table/interface";


export function DataTableUpdateRowSheet<T>({
									data,
									onOpenChange,
	title,
	description,
	children,
									...props
								}: DataTableUpdateRowSheetProps<T>) {

	return (
		<Sheet onOpenChange={onOpenChange} {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md">
				<SheetHeader className="text-left">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>
						{description}
					</SheetDescription>
				</SheetHeader>
				{children}
			</SheetContent>
		</Sheet>
	)
}
