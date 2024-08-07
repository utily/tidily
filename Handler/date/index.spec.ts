/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isoly } from "isoly"
import { Action } from "../../Action"
import { format, get } from "../index"

describe("Date handler", () => {
	const handlers = { gb: get("date", "en-GB"), us: get("date", "en-US"), standard: get("date") }
	it("Date fromString", () => {
		expect(handlers.gb?.fromString("31122021")).toEqual("2021-12-31")
		expect(handlers.us?.fromString("12312021")).toEqual("2021-12-31")
		expect(handlers.standard?.fromString("20211231")).toEqual("2021-12-31")
	})
	it("key event full date with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1230202012")
			result = Action.apply(handlers.us!, result, { key: character })
		expect(result).toMatchObject({ value: "12/30/2020", selection: { start: 10, end: 10 } })
	})
	it.only.each([
		["2024-11-21", "sv-SE", "2024-11-21"],
		["2024-01-31", "en-GB", "31/01/2024"],
		["2024-07-04", "en-US", "07/04/2024"],
	] as [isoly.Date, isoly.Locale, string][])("format", (date, locale, formattedDate) => {
		expect(format(date, "date", locale)).toEqual(formattedDate)
	})
})
