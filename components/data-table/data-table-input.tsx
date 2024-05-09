"use client";

import * as React from "react";
import {InputHTMLAttributes, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";

export function DataTableInput({
								   value: initialValue,
								   onChange,
								   debounce = 500,
								   ...props
							   }: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    );
}