import { Action } from "../../Action"
import { Formatter } from "../../Formatter"
import { get } from "../index"

describe("date us", () => {
	const handler = get("date", "en-US") as Formatter
	it("first digit of day must be smaller than 4", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("second digit of day must be 0 or 1 if first digit is 3", () => {
		const result = Action.apply(handler, { value: "1", selection: { start: 1, end: 1 } }, { key: "2" })
		expect(result).toMatchObject({ value: "12/", selection: { start: 3, end: 3 } })
	})
	it("only splitter is allowed in third digit", () => {
		const result = Action.apply(handler, { value: "12", selection: { start: 2, end: 2 } }, { key: "/" })
		expect(result).toMatchObject({ value: "12/", selection: { start: 3, end: 3 } })
	})
	it("first digit of month must be smaller than 2", () => {
		const result = Action.apply(handler, { value: "12/", selection: { start: 3, end: 3 } }, { key: "3" })
		expect(result).toMatchObject({ value: "12/3", selection: { start: 4, end: 4 } })
	})
	it("second digit of month must be smaller than 3", () => {
		const result = Action.apply(handler, { value: "12/3", selection: { start: 4, end: 4 } }, { key: "1" })
		expect(result).toMatchObject({ value: "12/31/", selection: { start: 6, end: 6 } })
	})
	it("only splitter is allowed in sixth digit", () => {
		const result = Action.apply(handler, { value: "12/31", selection: { start: 5, end: 5 } }, { key: "/" })
		expect(result).toMatchObject({ value: "12/31/", selection: { start: 6, end: 6 } })
	})
	it("only numbers are allowed in year", () => {
		const result = Action.apply(handler, { value: "12/31/", selection: { start: 9, end: 9 } }, { key: "1" })
		expect(result).toMatchObject({ value: "12/31/1", selection: { start: 10, end: 10 } })
	})

	it("date test end of months", () => {
		expect(Action.apply(handler, { value: "01/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "01/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "02/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "02/28/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "03/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "03/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "04/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "04/30/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "05/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "05/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "06/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "06/30/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "07/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "07/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "08/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "08/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "09/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "09/30/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "10/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "10/31/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "11/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "11/30/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "12/31/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "12/31/2021",
			selection: { start: 10, end: 10 },
		})
	})
})
