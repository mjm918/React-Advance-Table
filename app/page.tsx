"use client";

import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {ColumnDef, Table} from "@tanstack/react-table";
import {makeData, Person} from "@/lib/makeData";
import {isWithinInterval} from "date-fns";
import {AdvancedDataTable} from "@/components/data-table";
import {DataTableCheckBox} from "@/components/data-table/data-table-checkbox";
import {Button} from "@/components/ui/button";
import {GitHubLogoIcon} from "@radix-ui/react-icons";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const data = makeData(100_000);
export default function Home() {
    const [isLoading, setLoading] = useState(true);
    const filename = "exampleExport";
    const columns = useMemo<ColumnDef<Person>[]>(
        () => [
            {
                id: "select",
                header: ({ table }: { table: Table<Person> }) => (
                    <div className={"pt-1"}>
                        <DataTableCheckBox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className={"pt-1"}>
                        <DataTableCheckBox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    </div>
                ),
                size: 50
            },
            {
                header: "First Name",
                accessorKey: "firstName",
                id: "firstName",
                cell: info => info.getValue()
            },
            {
                accessorFn: row => row.lastName,
                id: "lastName",
                cell: info => info.getValue(),
                header: "Last Name",
            },
            {
                accessorFn: row => row.jobType,
                id: "jobType",
                cell: info => info.getValue(),
                header: "Job Type",
            },
            {
                accessorFn: row => row.address,
                id: "address",
                cell: info => info.getValue(),
                header: "Address"
            },
            {
                accessorFn: row => row.locality,
                id: "locality",
                cell: info => info.getValue(),
                header: "Locality",
                meta: {
                    filterVariant: "select",
                }
            },
            {
                accessorKey: "age",
                id: "age",
                header: "Age",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "visits",
                id: "visits",
                header: "Visits",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "lastUpdate",
                id: "lastUpdate",
                header: "Last Update",
                cell: info => {
                    const str = info.getValue() as Date;
                    return str.toLocaleDateString();
                },
                meta: {
                    filterVariant: "date",
                },
                filterFn: (row, columnId, filterValue) => {
                    const columnDate = row.getValue(columnId) as Date;
                    const {from, to} = filterValue;
                    return isWithinInterval(columnDate,{ start: from, end: to || from });
                }
            },
            {
                accessorKey: "status",
                id: "status",
                header: "Status",
                meta: {
                    filterVariant: "select",
                },
            }
        ],
        []
    );

    useEffect(()=>{
        const tmo = setTimeout(()=>{
            setLoading(false);
            clearTimeout(tmo);
        },5000);
    },[]);

    return (
        <>
            <Alert className={"mb-2"}>
                <AlertTitle>
                    React Advance Table - Using TanStack Table
                </AlertTitle>
                <AlertDescription className={"text-slate-500 text-xs"}>
                    This is not a library or anything. Just an example of TanStack React Table.
                    <div className={"flex flex-row items-center max-w-64 float-right -mt-2"}>
                        <span className={"text-xs items-center"}>
                            Project available on
                        </span>
                        <Button className={"text-xs"} variant={"link"}>
                            <GitHubLogoIcon/>
                            <a className={"ml-1"} target={"_blank"} href={"https://github.com/mjm918/React-Advance-Table"}>Github</a>
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
            <AdvancedDataTable<Person>
                id={"example-advance-table"}
                columns={columns}
                data={data}
                exportProps={{
                    exportFileName: filename
                }}
                actionProps={{
                    onDelete: (props) => {
                        console.log(props);
                    }
                }}
                onRowClick={(prop) => {
                    console.log(prop);
                }}
                contextMenuProps={{
                    enableEdit: true,
                    enableDelete: true,
                    extra: {
                        "Copy to clipboard": (data) => {
                            console.log("are we here?", data);
                        }
                    }
                }}
                addDataProps={{
                    enable: true,
                    title: "Add a new netizen",
                    description: "Netizens can be rude sometimes. Add them with caution.",
                    onSubmitNewData: netizen=> {

                    }
                }}
                isLoading={isLoading}
                dataValidationProps={[]}
            />
        </>
    );
}