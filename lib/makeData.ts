import { faker } from '@faker-js/faker'
import {TAdvancedDataTableDataProps} from "@/components/data-table";

export type Person = {
	firstName: string
	lastName: string
	age: number
	visits: number
	lastUpdate: Date
	status: 'relationship' | 'complicated' | 'single'
	subRows?: Person[]
}

const range = (len: number) => {
	const arr: number[] = []
	for (let i = 0; i < len; i++) {
		arr.push(i)
	}
	return arr
}

const newPerson = (): Person => {
	return {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		age: faker.number.int(40),
		visits: faker.number.int(1000),
		lastUpdate: faker.date.future(),
		status: faker.helpers.shuffle<Person['status']>([
			'relationship',
			'complicated',
			'single',
		])[0]!,
	}
}

export function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): Person[] => {
		const len = lens[depth]!
		return range(len).map((d): Person => {
			return {
				...newPerson(),
				subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
			}
		})
	}

	return makeDataLevel()
}

const data = makeData(100_000)

export async function simulateFetch(options: {
	pageIndex: number
	pageSize: number
}): Promise<TAdvancedDataTableDataProps<Person>> {
	// Simulate some network latency
	await new Promise(r => setTimeout(r, 1000))

	return {
		rows: data.slice(
			options.pageIndex * options.pageSize,
			(options.pageIndex + 1) * options.pageSize
		),
		pageCount: Math.ceil(data.length / options.pageSize),
		rowCount: data.length,
	}
}