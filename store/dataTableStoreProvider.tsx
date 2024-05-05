import {PropsWithChildren, useRef} from "react";
import {createDataTableStore, DataTableProvider, DataTableStoreType, IDataTableStore} from "@/store/dataTableStore";

export const DataTableStoreProvider = ({children, ...props}:PropsWithChildren<IDataTableStore>) => {
	const storeRef = useRef<DataTableStoreType>();
	if (!storeRef.current) {
		storeRef.current = createDataTableStore({...props});
	}
	return <DataTableProvider value={storeRef.current}>{children}</DataTableProvider>;
};