import { faker } from "@faker-js/faker";

export type Person = {
	firstName: string
	lastName: string
	gender: string
	jobType: string
	address: string
	locality: string
	age: number
	visits: number
	lastUpdate: Date
	status: "relationship" | "complicated" | "single"
	subRows?: Person[]
}

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (): Person => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        jobType: faker.person.jobType(),
		gender: faker.helpers.shuffle<Person["gender"]>([
			"male",
			"female"
		])[0]!,
        address: faker.location.streetAddress({useFullAddress: true}),
        locality: faker.location.country(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        lastUpdate: faker.date.future(),
        status: faker.helpers.shuffle<Person["status"]>([
            "relationship",
            "complicated",
            "single",
        ])[0]!,
    };
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((d): Person => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}