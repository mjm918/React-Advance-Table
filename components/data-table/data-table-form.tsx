"use client";

import {ControllerRenderProps, UseFormReturn} from "react-hook-form";
import {z, ZodType} from "zod";
import {TDataTableDataValidation} from "@/@types";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import _ from "lodash";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Checkbox} from "@/components/ui/checkbox";

export function DataTableForm<FormType extends ZodType<any, any, any>>({schemas, form, onSubmit}:{schemas: TDataTableDataValidation[]; form: UseFormReturn<{},any,undefined>; onSubmit: z.infer<FormType>}) {
	return (
		<Form {...form}>
			<form className={"space-y-2"} onSubmit={form.handleSubmit(onSubmit)}>
				{
					schemas.map((schemaProp, index) => {
						const {
							id,
							component,
							label,
							description
						} = schemaProp;
						if (component === "checkbox") {
							return (
								<UserRequiredField key={String("--this-form-").concat(id, index.toString())} {...schemaProp} formProps={form}/>
							);
						}
						return (
							<FormField
								key={String("--this-form-").concat(id, index.toString())}
								control={form.control}
								name={id as never}
								render={({field}) => (
									<FormItem>
										{
											!_.isEmpty(label) && (
												<FormLabel className={"uppercase text-xs text-slate-500 font-bold"}>
													{label}
												</FormLabel>
											)
										}
										<FormControl>
											<UserRequiredField formProps={form} {...schemaProp} formFieldProps={field}/>
										</FormControl>
										{
											!_.isEmpty(description) && (
												<FormDescription>
													{description}
												</FormDescription>
											)
										}
										<FormMessage/>
									</FormItem>
								)}
							/>
						);
					})
				}
				<div className={"h-6"}></div>
				<Button onClick={event => event.stopPropagation()} className={"w-full"} type="submit">Submit</Button>
			</form>
		</Form>
	);
}

function UserRequiredField({id: formId,placeholder,component,componentCssProps,data,label,description,formProps,formFieldProps}:Partial<TDataTableDataValidation> & { formFieldProps?: ControllerRenderProps<{},never>; formProps?: UseFormReturn<{}, any, undefined> }) {
	const [inStateOpen, setInStateOpen] = useState<boolean>(false);
	const [inStateValue, setInStateValue] = useState(formFieldProps?.value || "");
	if (component === "input") {
		return (
			<Input placeholder={placeholder} className={componentCssProps?.parent} {...formFieldProps}/>
		);
	}
	if (component === "select" && formFieldProps) {
		return (
			<Select onValueChange={formFieldProps.onChange} {...formFieldProps}>
				<SelectTrigger className={componentCssProps?.parent || "w-[180px]"}>
					<SelectValue placeholder={placeholder ?? "--"} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{
							!_.isEmpty(label) && (
								<SelectLabel>{label}</SelectLabel>
							)
						}
						{
							!_.isEmpty(data) && data?.map(({value, children},index) => <SelectItem key={value.concat("--",index.toString())} value={value}>{children}</SelectItem>)
						}
					</SelectGroup>
				</SelectContent>
			</Select>
		);
	}
	if (component === "combobox" && formFieldProps && formProps) {
		const onSelect = (value1: string) => {
			setInStateValue(value1);
			setInStateOpen(false);
			formProps.setValue(formId as never, value1 as never);
		};
		return (
			<Popover open={inStateOpen} onOpenChange={setInStateOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={inStateOpen}
						className={componentCssProps?.parent || "w-[180px] justify-between"}>
						{inStateValue && !_.isEmpty(data)
							? data?.find((d) => d.value === inStateValue)?.children
							: (placeholder || "--")}
						<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className={componentCssProps?.parent || "w-[180px] p-0"}>
					<Command>
						<CommandInput placeholder={"Search anything..."} className="h-9"/>
						<CommandList>
							<CommandEmpty>No record found.</CommandEmpty>
							<CommandGroup>
								{
									!_.isEmpty(data) && data?.map(({value, children},index) => {
										return (
											<CommandItem
												className={componentCssProps?.child}
												key={value.concat("--",index.toString())}
												onSelect={onSelect}
												value={value}>
												{children}
												<CheckIcon
													className={cn(
														"ml-auto h-4 w-4",
														inStateValue === value ? "opacity-100" : "opacity-0"
													)}
												/>
											</CommandItem>
										);
									})
								}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	}
	if (component === "radio" && formFieldProps) {
		return (
			<RadioGroup
				onValueChange={formFieldProps.onChange}
				defaultValue={formFieldProps.value}
				className="flex flex-col space-y-1">
				{
					!_.isEmpty(data) && data?.map(({value,children},index)=>{
						return (
							<FormItem key={value.concat("--",index.toString())} className="flex items-center space-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value={value} />
								</FormControl>
								<FormLabel className="font-normal">
									{children}
								</FormLabel>
							</FormItem>
						);
					})
				}
			</RadioGroup>
		);
	}
	if (component === "checkbox" && formProps) {
		return (
			<FormField
				control={formProps.control}
				name={formId as never}
				render={() => (
					<FormItem>
						<div className="mb-2">
							{
								!_.isEmpty(label) && (
									<FormLabel className={"uppercase text-xs text-slate-500 font-bold"}>{label}</FormLabel>
								)
							}
							{
								!_.isEmpty(description) && (
									<FormDescription>
										{description}
									</FormDescription>
								)
							}
						</div>
						{(data || []).map((item) => (
							<FormField
								key={item.value}
								control={formProps.control}
								name={formId as never}
								render={({ field }) => {
									return (
										<FormItem
											key={item.value}
											className={componentCssProps?.parent || "flex flex-row items-center space-x-3 space-y-0"}>
											<FormControl>
												<Checkbox
													checked={(field.value as any[])?.includes(item.value)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, item.value])
															: field.onChange(
																(field.value as any[])?.filter(
																	(value: string) => value !== item.value
																)
															)
													}}
												/>
											</FormControl>
											<FormLabel className={componentCssProps?.child || "text-sm font-normal"}>
												{item.children}
											</FormLabel>
										</FormItem>
									)
								}}
							/>
						))}
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	}
	return null;
}