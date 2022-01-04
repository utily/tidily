import { Action } from "../../Action"
import { get } from "../index"

describe("date en-US", () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const handler = get("date", "en-US")!
	it("fromString", () => expect(handler.fromString("12312021")).toEqual("2021-12-31"))
	it("toString", () => expect(handler.toString("2021-12-31")).toEqual("12/31/2021"))
	it("first digit of month smaller than 2", () =>
		expect(Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })).toMatchObject({
			value: "1",
			selection: { start: 1, end: 1 },
		}))
	it("first digit of month larger than 1", () =>
		expect(Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "2" })).toMatchObject({
			value: "02/",
			selection: { start: 3, end: 3 },
		}))
	it("second digit of month must be 0 - 2 if first digit is 1", () =>
		expect(Action.apply(handler, { value: "1", selection: { start: 1, end: 1 } }, { key: "2" })).toMatchObject({
			value: "12/",
			selection: { start: 3, end: 3 },
		}))
	it("first digit of day smaller than 4", () =>
		expect(Action.apply(handler, { value: "12/", selection: { start: 3, end: 3 } }, { key: "3" })).toMatchObject({
			value: "12/3",
			selection: { start: 4, end: 4 },
		}))
	it("first digit of day larger than 3", () =>
		expect(Action.apply(handler, { value: "12/", selection: { start: 3, end: 3 } }, { key: "4" })).toMatchObject({
			value: "12/04/",
			selection: { start: 6, end: 6 },
		}))
	it("12/3 + 1", () =>
		expect(Action.apply(handler, { value: "12/3", selection: { start: 4, end: 4 } }, { key: "1" })).toMatchObject({
			value: "12/31/",
			selection: { start: 6, end: 6 },
		}))
	it("12/3 + 2", () =>
		expect(Action.apply(handler, { value: "12/3", selection: { start: 4, end: 4 } }, { key: "2" })).toMatchObject({
			value: "12/3",
			selection: { start: 4, end: 4 },
		}))
	it("11/3 + 1", () =>
		expect(Action.apply(handler, { value: "11/3", selection: { start: 4, end: 4 } }, { key: "1" })).toMatchObject({
			value: "11/3",
			selection: { start: 4, end: 4 },
		}))
	it("02/ + 3", () =>
		expect(Action.apply(handler, { value: "02/", selection: { start: 3, end: 3 } }, { key: "3" })).toMatchObject({
			value: "02/03/",
			selection: { start: 6, end: 6 },
		}))
	it("12/31/1 + 1", () =>
		expect(Action.apply(handler, { value: "12/31/", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "12/31/1",
			selection: { start: 10, end: 10 },
		}))
	it("date test not leap year", () =>
		expect(Action.apply(handler, { value: "02/29/200", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "02/29/200",
			selection: { start: 9, end: 9 },
		}))
	it("date test leap year", () =>
		expect(Action.apply(handler, { value: "02/29/200", selection: { start: 9, end: 9 } }, { key: "4" })).toMatchObject({
			value: "02/29/2004",
			selection: { start: 10, end: 10 },
		}))
	it("beyond full length", () =>
		expect(
			Action.apply(handler, { value: "02/29/2020", selection: { start: 10, end: 10 } }, { key: "1" })
		).toMatchObject({
			value: "02/29/2020",
			selection: { start: 10, end: 10 },
		}))
})
