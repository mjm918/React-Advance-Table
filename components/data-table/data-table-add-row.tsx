"use client";

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ListPlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDataTableStore} from "@/store/dataTableStore";
import _ from "lodash";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Separator} from "@/components/ui/separator";
import React from "react";
import {DataTableForm} from "@/components/data-table/data-table-form";

export function DataTableAddRow() {
    const {title, description, onSubmitNewData, schemas} = useDataTableStore(state => ({
        ...state.addDataProps,
        schemas: state.dataValidationProps
    }));
    const getFormSchema = () => {
        const defaultValues: { [k: string]: string } = {};
        if (schemas instanceof Array && schemas.length > 0) {
            const obj: { [k: string]: z.ZodType } = {};
            schemas.forEach(item => {
                obj[item.id] = item.schema;
                defaultValues[item.id] = "";
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
		onSubmitNewData && onSubmitNewData(data);
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    aria-label="Toggle create new"
                    variant="default"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex">
                    <ListPlusIcon className="mr-2 size-4"/>
                    Create New
                </Button>
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