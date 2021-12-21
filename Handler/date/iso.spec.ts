import { Action } from "../../Action"
import { get } from "../index"

describe("date iso", () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const handler = get("date")!
	it("fromString", () => expect(handler.fromString("20211231")).toEqual("2021-12-31"))
	it("toString", () => expect(handler.toString("2021-12-31")).toEqual("2021-12-31"))
	it("only splitter is allowed in fifth digit", () =>
		expect(Action.apply(handler, { value: "202", selection: { start: 3, end: 3 } }, { key: "1" })).toMatchObject({
			value: "2021-",
			selection: { start: 5, end: 5 },
		}))
	it("only splitter is allowed in fifth digit", () =>
		expect(Action.apply(handler, { value: "2021", selection: { start: 4, end: 4 } }, { key: "2" })).toMatchObject({
			value: "2021-02-",
			selection: { start: 8, end: 8 },
		}))
	it("the first digit of month must be smaller than 2", () =>
		expect(Action.apply(handler, { value: "2020-", selection: { start: 5, end: 5 } }, { key: "1" })).toMatchObject({
			value: "2020-1",
			selection: { start: 6, end: 6 },
		}))
	it("the first digit of day should be smaller than 4", () =>
		expect(Action.apply(handler, { value: "2020-0", selection: { start: 6, end: 6 } }, { key: "3" })).toMatchObject({
			value: "2020-03-",
			selection: { start: 8, end: 8 },
		}))
	it("date test end of months - too big day", () =>
		expect(Action.apply(handler, { value: "202101", selection: { start: 6, end: 6 } }, { key: "1" })).toMatchObject({
			value: "2021-01-1",
			selection: { start: 9, end: 9 },
		}))
	it("end of month 2021-02- + 3", () =>
		expect(Action.apply(handler, { value: "2021-02-", selection: { start: 8, end: 8 } }, { key: "3" })).toMatchObject({
			value: "2021-02-03",
			selection: { start: 10, end: 10 },
		}))
	it("end of month 2021-02-2 + 9 (no leap year)", () =>
		expect(Action.apply(handler, { value: "2021-02-2", selection: { start: 9, end: 9 } }, { key: "9" })).toMatchObject({
			value: "2021-02-2",
			selection: { start: 9, end: 9 },
		}))
	it("end of month 2020-02-2 + 9 (leap year)", () =>
		expect(Action.apply(handler, { value: "2020-02-2", selection: { start: 9, end: 9 } }, { key: "9" })).toMatchObject({
			value: "2020-02-29",
			selection: { start: 10, end: 10 },
		}))
	it("beyond full length", () =>
		expect(
			Action.apply(handler, { value: "2020-02-29", selection: { start: 10, end: 10 } }, { key: "1" })
		).toMatchObject({
			value: "2020-02-29",
			selection: { start: 10, end: 10 },
		}))
})
