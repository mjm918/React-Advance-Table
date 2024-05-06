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