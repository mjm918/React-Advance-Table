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
	extra?: { [menuName: string]: (prop: any)=> void; }
};

export type TDataTableDataValidation = {
	schema: z.ZodType;
	Component: JSX.Element;
	label: string;
	description?: string;
	id: string;
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