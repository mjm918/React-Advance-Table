"use client";

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {ListPlusIcon} from "lucide-react";
import React from "react";
import {useDataTableStore} from "@/store/dataTableStore";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import _ from "lodash";
import {Separator} from "@/components/ui/separator";
import {DataTableForm} from "@/components/data-table/data-table-form";
import ReactHotkeys from "react-hot-keys";
import {ContextMenuItem, ContextMenuNotItem, ContextMenuShortcut} from "@/components/ui/context-menu";

export function DataTableEditRow<T>({presetData}:{presetData: {[k:string]: any;}}) {
	const {title, description, onSubmitEditData, schemas} = useDataTableStore(state => ({
		...state.editDataProps,
		schemas: state.dataValidationProps
	}));
	const getFormSchema = () => {
		const defaultValues: { [k: string]: string } = {};
		if (schemas instanceof Array && schemas.length > 0) {
			const obj: { [k: string]: z.ZodType } = {};
			schemas.forEach(item => {
				obj[item.id] = item.schema;
				defaultValues[item.id] = (item.id in presetData) ? presetData[item.id] : "";
			});
			return {schema: z.object(obj), defaultValues};
		}
		return {schema: z.object({}), defaultValues};
	};
	const FormSchema = getFormSchema();
	const form = useForm<z.infer<typeof FormSchema.schema>>({
		resolver: zodResolver(FormSchema.schema),
		defaultValues: FormSchema.defaultValues,
	});
	const onSubmit = (data: z.infer<typeof FormSchema.schema>) => {
		onSubmitEditData && onSubmitEditData(data);
	};
	const ignoreClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
	};
	return (
		<Sheet>
			<SheetTrigger asChild={false} className={"w-full"}>
				<ContextMenuNotItem>
					Edit Row
				</ContextMenuNotItem>
			</SheetTrigger>
			<SheetContent className={"space-y-2 overflow-y-auto"}>
				<SheetHeader>
					<SheetTitle>{title ?? "Create a new record in the list"}</SheetTitle>
					{
						!_.isEmpty(description) && (
							<SheetDescription>
								{description}
							</SheetDescription>
						)
					}
				</SheetHeader>
				<Separator/>
				{
					Object.keys(FormSchema.defaultValues).length > 0 && schemas !== undefined && (
						<DataTableForm schemas={schemas} form={form} onSubmit={onSubmit}/>
					)
				}
			</SheetContent>
		</Sheet>
	);
}