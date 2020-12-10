import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { Converter } from "../Converter"
import { get } from "./index"

describe("date-time", () => {
	const handler = get("date-time") as Converter<string> & Formatter
	it("date-time test time", () => {
		expect(
			Action.apply(handler, { value: "2021-12-31 ", selection: { start: 11, end: 11 } }, { key: "2" })
		).toMatchObject({
			value: "2021-12-31 2",
			selection: { start: 12, end: 12 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 ", selection: { start: 11, end: 11 } }, { key: "3" })
		).toMatchObject({
			value: "2021-12-31 23:",
			selection: { start: 14, end: 14 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 ", selection: { start: 11, end: 11 } }, { key: "5" })
		).toMatchObject({
			value: "2021-12-31 23:5",
			selection: { start: 15, end: 15 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 ", selection: { start: 11, end: 11 } }, { key: "9" })
		).toMatchObject({
			value: "2021-12-31 23:59",
			selection: { start: 16, end: 16 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 23:", selection: { start: 14, end: 14 } }, { key: "9" })
		).toMatchObject({
			value: "2021-12-31 23:59",
			selection: { start: 16, end: 16 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 23:", selection: { start: 14, end: 14 } }, { key: "9" })
		).toMatchObject({
			value: "2021-12-31 23:59",
			selection: { start: 16, end: 16 },
		})
		expect(
			Action.apply(handler, { value: "2021-12-31 23:59:", selection: { start: 17, end: 17 } }, { key: "9" })
		).toMatchObject({
			value: "2021-12-31 23:59:59",
			selection: { start: 19, end: 19 },
		})
	})
	it("date-time fromString() tests", () => {
		expect(handler.fromString("2020-12-28 23:59:59")).toEqual("2020-12-28T23:59:59.000Z")
		expect(handler.fromString("2020-12-28 23:59:5")).toEqual("2020-12-28T23:59:50.000Z")
		expect(handler.fromString("2020-12-28 23:59:")).toEqual("2020-12-28T23:59:00.000Z")
		expect(handler.fromString("2020-12-28 23:5")).toEqual("2020-12-28T23:50:00.000Z")
		expect(handler.fromString("2020-12-28 23:")).toEqual("2020-12-28T23:00:00.000Z")
		expect(handler.fromString("2020-12-28 23")).toEqual("2020-12-28T23:00:00.000Z")
		expect(handler.fromString("2020-12-28 2")).toEqual("2020-12-28T20:00:00.000Z")
		expect(handler.fromString("2020-12-28 ")).toEqual("2020-12-28T00:00:00.000Z")
		expect(handler.fromString("2020-12-28")).toEqual("2020-12-28T00:00:00.000Z")
		expect(handler.fromString("2020-12-2")).toEqual("2020-12-02T00:00:00.000Z")
		expect(handler.fromString("2020-12-")).toEqual("2020-12-01T00:00:00.000Z")
		expect(handler.fromString("2020-12")).toEqual("2020-12-01T00:00:00.000Z")
		expect(handler.fromString("2020-1")).toEqual("2020-01-01T00:00:00.000Z")
		expect(handler.fromString("2020-")).toBeUndefined()
		expect(handler.fromString("2020")).toBeUndefined()
		expect(handler.fromString("202")).toBeUndefined()
		expect(handler.fromString("20")).toBeUndefined()
		expect(handler.fromString("2")).toBeUndefined()
		expect(handler.fromString("")).toBeUndefined()
		expect(handler.fromString("2020-02-28   23:59:59 ")).toBeUndefined()
	})
})
