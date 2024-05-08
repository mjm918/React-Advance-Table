"use client";

import React, {ReactNode} from "react";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel,
	AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function RequestDeleteConfirmation({children, onConfirm, multiple}: { children: ReactNode; onConfirm: () => void; multiple?: boolean; }) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>This will permanently delete {multiple ? "all selected rows" : "the selected row"}. Are you sure you want to
						proceed?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete {multiple ? "all selected rows" : "the selected row"}? You won&apos;t be able to undo this action.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}