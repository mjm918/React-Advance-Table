"use client";

import {TooltipProvider} from "@/components/ui/tooltip";
import {DataTableStoreProvider} from "@/store/dataTableStoreProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
const queryClient = new QueryClient()
export function Providers({children}: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<DataTableStoreProvider isSelecting={false}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</DataTableStoreProvider>
		</TooltipProvider>
	);
}