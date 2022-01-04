import { Action } from "../../Action"
import { get } from "../index"

describe("date en-GB", () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const handler = get("date", "en-GB")!
	it("fromString", () => expect(handler.fromString("31122021")).toEqual("2021-12-31"))
	it("toString", () => expect(handler.toString("2021-12-31")).toEqual("31/12/2021"))
	it("first digit of day smaller than 4", () =>
		expect(Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "3" })).toMatchObject({
			value: "3",
			selection: { start: 1, end: 1 },
		}))
	it("first digit of day bigger than 3", () =>
		expect(Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "4" })).toMatchObject({
			value: "04/",
			selection: { start: 3, end: 3 },
		}))
	it("second digit of day must be 0 or 1 if first digit is 3", () =>
		expect(Action.apply(handler, { value: "3", selection: { start: 1, end: 1 } }, { key: "1" })).toMatchObject({
			value: "31/",
			selection: { start: 3, end: 3 },
		}))
	it("first digit of month smaller than 2", () =>
		expect(Action.apply(handler, { value: "31/", selection: { start: 3, end: 3 } }, { key: "1" })).toMatchObject({
			value: "31/1",
			selection: { start: 4, end: 4 },
		}))
	it("first digit of month larger than 1", () =>
		expect(Action.apply(handler, { value: "31/", selection: { start: 3, end: 3 } }, { key: "3" })).toMatchObject({
			value: "31/03/",
			selection: { start: 6, end: 6 },
		}))
	it("second digit of month must be smaller than 3", () =>
		expect(Action.apply(handler, { value: "31/1", selection: { start: 4, end: 4 } }, { key: "0" })).toMatchObject({
			value: "31/10/",
			selection: { start: 6, end: 6 },
		}))
	it("only splitter is allowed in sixth digit", () =>
		expect(Action.apply(handler, { value: "31/10", selection: { start: 5, end: 5 } }, { key: "/" })).toMatchObject({
			value: "31/10/",
			selection: { start: 6, end: 6 },
		}))
	it("only numbers are allowed in year", () =>
		expect(Action.apply(handler, { value: "30/10/202", selection: { start: 9, end: 9 } }, { key: "0" })).toMatchObject({
			value: "30/10/2020",
			selection: { start: 10, end: 10 },
		}))
	it("date test end of February", () =>
		expect(Action.apply(handler, { value: "31/0", selection: { start: 4, end: 4 } }, { key: "2" })).toMatchObject({
			value: "31/0",
			selection: { start: 4, end: 4 },
		}))
	it("date test leap day", () =>
		expect(Action.apply(handler, { value: "29/0", selection: { start: 4, end: 4 } }, { key: "2" })).toMatchObject({
			value: "29/02/",
			selection: { start: 6, end: 6 },
		}))
	it("date test leap day no zero", () =>
		expect(Action.apply(handler, { value: "29/", selection: { start: 3, end: 3 } }, { key: "2" })).toMatchObject({
			value: "29/02/",
			selection: { start: 6, end: 6 },
		}))
	it("date test end of February, single digit", () =>
		expect(Action.apply(handler, { value: "31/", selection: { start: 3, end: 3 } }, { key: "2" })).toMatchObject({
			value: "31/",
			selection: { start: 3, end: 3 },
		}))
	it("date test end of months", () =>
		expect(Action.apply(handler, { value: "31/1", selection: { start: 4, end: 4 } }, { key: "1" })).toMatchObject({
			value: "31/1",
			selection: { start: 4, end: 4 },
		}))
	it("date test end of months", () =>
		expect(Action.apply(handler, { value: "31/0", selection: { start: 4, end: 4 } }, { key: "3" })).toMatchObject({
			value: "31/03/",
			selection: { start: 6, end: 6 },
		}))
	it("date test not leap year", () =>
		expect(Action.apply(handler, { value: "29/02/200", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "29/02/200",
			selection: { start: 9, end: 9 },
		}))
	it("date test leap year", () =>
		expect(Action.apply(handler, { value: "29/02/200", selection: { start: 9, end: 9 } }, { key: "4" })).toMatchObject({
			value: "29/02/2004",
			selection: { start: 10, end: 10 },
		}))
	it("beyond full length", () =>
		expect(
			Action.apply(handler, { value: "29/02/2020", selection: { start: 10, end: 10 } }, { key: "1" })
		).toMatchObject({
			value: "29/02/2020",
			selection: { start: 10, end: 10 },
		}))
})
