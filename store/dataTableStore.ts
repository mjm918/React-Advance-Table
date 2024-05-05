import {createContext, useContext} from "react";
import {combine} from "zustand/middleware";
import {createStore as createZustandStore, useStore as useZustandStore} from "zustand";

export interface IDataTableStore {
	isSelecting: boolean;
}

const getDefaultState = (): IDataTableStore => ({ isSelecting: false });

export const createDataTableStore = (preloadedState: IDataTableStore) => {
	return createZustandStore(combine({...getDefaultState(), ...preloadedState},(set, get, store)=>({
		setLanguage: (props: boolean) => {
			set({
				isSelecting: props
			});
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