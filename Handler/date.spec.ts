import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("date", () => {
	const handler = get("date") as Formatter
	it("date key event year last digit + auto dash", () => {
		const result = Action.apply(handler, { value: "2020", selection: { start: 4, end: 4 } }, { key: "1" })
		expect(result).toMatchObject({ value: "2020-1", selection: { start: 6, end: 6 } })
	})
	it("date key event month trigger format", () => {
		const result = Action.apply(handler, { value: "2020-", selection: { start: 5, end: 5 } }, { key: "2" })
		expect(result).toMatchObject({ value: "2020-02", selection: { start: 7, end: 7 } })
	})
	it("date key event month last digit trigger format", () => {
		const result = Action.apply(handler, { value: "2020-02-", selection: { start: 8, end: 8 } }, { key: "4" })
		expect(result).toMatchObject({ value: "2020-02-04", selection: { start: 10, end: 10 } })
	})
	it("date key event 29 february (leap year) last digit trigger format", () => {
		const result = Action.apply(handler, { value: "2020-02-2", selection: { start: 9, end: 9 } }, { key: "9" })
		expect(result).toMatchObject({ value: "2020-02-29", selection: { start: 10, end: 10 } })
	})
	it("date key event 29 february last digit trigger format", () => {
		const result = Action.apply(handler, { value: "2021-02-2", selection: { start: 9, end: 9 } }, { key: "9" })
		expect(result).toMatchObject({ value: "2021-02-28", selection: { start: 10, end: 10 } })
	})
	it("date test end of months - too big day", () => {
		expect(Action.apply(handler, { value: "2021-01-3", selection: { start: 9, end: 9 } }, { key: "2" })).toMatchObject({
			value: "2021-01-31",
			selection: { start: 10, end: 10 },
		})
	})
	it("date test end of months", () => {
		expect(Action.apply(handler, { value: "2021-01-3", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "2021-01-31",
			selection: { start: 10, end: 10 },
		})
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
