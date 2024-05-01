"use client"

import * as React from "react"
import {TrashIcon} from "@radix-ui/react-icons"

import {Button} from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {DataTableDeleteRowProps} from "@/components/data-table/interface";

export function DataTableDeleteRows<T>({
										rows,
										title,
										description,
										showDeleteTrigger,
										children,
										buttonTitle,
										...props
								  }: DataTableDeleteRowProps<T>) {
	return (
		<Dialog {...props}>
			{showDeleteTrigger ? (
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						{buttonTitle} ({rows.length})
					</Button>
				</DialogTrigger>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					{children}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
