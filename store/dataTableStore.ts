import {createContext, useContext} from "react";
import {combine} from "zustand/middleware";
import {createStore as createZustandStore, useStore as useZustandStore} from "zustand";
import {
	TDataTableAddDataProps,
	TDataTableContextMenuProps, TDataTableDataValidation,
	TDataTableEditDataProps,
	TDataTableExportProps
} from "@/@types";

export interface IDataTableStore {
	isSelecting: boolean;
	exportProps?: TDataTableExportProps;
	contextMenuProps?: TDataTableContextMenuProps;
	addDataProps?: TDataTableAddDataProps<any>;
	editDataProps?: TDataTableEditDataProps<any>;
	dataValidationProps?: TDataTableDataValidation[];
}

const getDefaultState = (): IDataTableStore => ({ isSelecting: false, exportProps: undefined, contextMenuProps: undefined, addDataProps: undefined, editDataProps: undefined, dataValidationProps: []  });

export const createDataTableStore = (preloadedState: IDataTableStore) => {
	return createZustandStore(combine({...getDefaultState(), ...preloadedState},(set, get, store)=>({
		toggleSelection: () => {
			set(prev=>({
				isSelecting: !prev.isSelecting
			}));
		},
		setExtraProps: (
			exportProps: TDataTableExportProps | undefined,
			contextMenuProps: TDataTableContextMenuProps | undefined,
			addDataProps: TDataTableAddDataProps<any> | undefined,
			editDataProps: TDataTableEditDataProps<any> | undefined,
			dataValidationProps: TDataTableDataValidation[] | undefined,
		) => {
			set(()=>({
				exportProps,
				contextMenuProps,
				addDataProps,
				editDataProps,
				dataValidationProps: dataValidationProps ?? []
			}));
		}
	})));
};

export type DataTableStoreType = ReturnType<typeof createDataTableStore>;
type DataTableStoreInterface = ReturnType<DataTableStoreType["getState"]>;

const zustandContext = createContext<DataTableStoreType | null>(null);
export const DataTableProvider = zustandContext.Provider;

export const useDataTableStore = <T>(selector: (state: DataTableStoreInterface) => T) => {
	const store = useContext(zustandContext);
	if (!store) throw new Error("Language Store is missing the provider");
	return useZustandStore(store, selector);
};