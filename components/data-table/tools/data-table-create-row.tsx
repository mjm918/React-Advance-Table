"use client"

import * as React from "react"
import {PlusIcon} from "@radix-ui/react-icons"
import {Button} from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {DataTableCreateRowProps} from "@/components/data-table/interface";


export function DataTableCreateRow<T>({ title, description, buttonTitle, children }: DataTableCreateRowProps<T>) {
	const [open, setOpen] = React.useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<PlusIcon className="mr-2 size-4" aria-hidden="true" />
					{buttonTitle}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description}
					</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
