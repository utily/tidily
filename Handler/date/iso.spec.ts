import { Action } from "../../Action"
import { Formatter } from "../../Formatter"
import { get } from "../index"

describe("date iso", () => {
	const handler = get("date") as Formatter
	it("only splitter is allowed in fifth digit", () => {
		const result = Action.apply(handler, { value: "202", selection: { start: 3, end: 3 } }, { key: "1" })
		expect(result).toMatchObject({ value: "2021-", selection: { start: 5, end: 5 } })
	})
	it("only splitter is allowed in fifth digit", () => {
		const result = Action.apply(handler, { value: "2021", selection: { start: 4, end: 4 } }, { key: "-" })
		expect(result).toMatchObject({ value: "2021-", selection: { start: 5, end: 5 } })
	})
	it("the first digit of month must be smaller than 2", () => {
		const result = Action.apply(handler, { value: "2020-", selection: { start: 5, end: 5 } }, { key: "1" })
		expect(result).toMatchObject({ value: "2020-1", selection: { start: 6, end: 6 } })
	})
	it("the first digit of day should be smaller than 4", () => {
		const result = Action.apply(handler, { value: "2020-0", selection: { start: 6, end: 6 } }, { key: "3" })
		expect(result).toMatchObject({ value: "2020-03-", selection: { start: 8, end: 8 } })
	})
	it("date test end of months - too big day", () => {
		expect(Action.apply(handler, { value: "2021-01-", selection: { start: 8, end: 8 } }, { key: "1" })).toMatchObject({
			value: "2021-01-1",
			selection: { start: 9, end: 9 },
		})
	})
	it("date test end of months", () => {
		expect(Action.apply(handler, { value: "2021-02-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-02-28",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-03-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-03-31",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-04-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-04-30",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-05-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-05-31",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-06-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-06-30",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-07-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-07-31",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-08-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-08-31",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-09-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-09-30",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-10-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-10-31",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-11-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-11-30",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "2021-12-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-12-31",
			selection: { start: 10, end: 10 },
		})
	})
})
