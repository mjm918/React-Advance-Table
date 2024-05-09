"use client";

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ListPlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDataTableStore} from "@/store/dataTableStore";
import _ from "lodash";
import {z} from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export function DataTableAddRow() {
    const {title, description, onSubmitNewData, schemas} = useDataTableStore(state => ({
        ...state.addDataProps,
        schemas: state.dataValidationProps
    }));
    const getFormSchema = () => {
        const defaultValues: { [k:string]: string } = {};
        if (schemas instanceof Array && schemas.length > 0) {
            const obj: { [k:string]: z.ZodType } = {};
            schemas.forEach(item=>{
                obj[item.id] = item.schema;
                defaultValues[item.id] = "";
            });
            return { schema: z.object(obj), defaultValues };
        }
        return { schema: z.object({}), defaultValues };
    };
    const FormSchema = getFormSchema();
    const form = useForm<z.infer<typeof FormSchema.schema>>({
        resolver: zodResolver(FormSchema.schema),
        defaultValues: FormSchema.defaultValues,
    });
    const onSubmit = (data: z.infer<typeof FormSchema.schema>) => {

    };
    return (
        <Sheet>
            <SheetTrigger>
                <Button
                    aria-label="Toggle columns"
                    variant="default"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex">
                    <ListPlusIcon className="mr-2 size-4" />
                    Create New
                </Button>
            </SheetTrigger>
            <SheetContent>
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
                {
                    Object.keys(FormSchema.defaultValues).length > 0 && schemas !== undefined && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {
                                    schemas.map(({id, Component, label, description},index)=>
                                        <FormField
                                            key={String("--this-form-").concat(id,index.toString())}
                                            control={form.control}
                                            name={id as never}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{label}</FormLabel>
                                                    <FormControl>
                                                        {/* @ts-ignore */}
                                                        {Component && (<Component {...field} />)}
                                                    </FormControl>
                                                    {
                                                        !_.isEmpty(description) && (
                                                            <FormDescription>
                                                                {description}
                                                            </FormDescription>
                                                        )
                                                    }
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />)
                                }
                            </form>
                        </Form>
                    )
                }
            </SheetContent>
        </Sheet>
    );
}