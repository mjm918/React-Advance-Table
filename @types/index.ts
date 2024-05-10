import {z} from "zod";
import React, {ReactNode} from "react";

export type TDataTableExportProps = {
	exportFileName: string;
	excludeColumns?: string[];
	onUserExport?: (data: any[])=> void;
};

export type TDataTableContextMenuProps = {
	enableEdit: boolean;
	enableDelete: boolean;
	onDelete: (prop: any) => void;
	extra?: { [menuName: string]: (prop: any)=> void; }
};

export type TDataTableDataValidation = {
	id: string;
	component: "select" | "input" | "radio" | "date" | "date-range" | "checkbox" | "combobox";
	componentCssProps?: {
		parent?: string;
		child?: string;
	};
	label?: string;
	description?: string;
	placeholder?: string;
	data?: {
		value: string;
		children: React.ReactNode;
	}[];
	schema: z.ZodType;
};

export type TDataTableAddDataProps<T> = {
	enable: boolean;
	onSubmitNewData: (data: T) => void;
	title: string;
	description: string;
};

export type TDataTableEditDataProps<T> = {
	onSubmitEditData?: (data: T) => void;
	title: string;
	description: string;
};