/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isoly } from "isoly"
import { tidily } from "../.."
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
	it.each([
		["sv-SE", "2024-11-21", "2024-11-21"],
		["en-GB", "2024-01-31", "31/01/2024"],
		["en-US", "2024-07-04", "07/04/2024"],
	] as [isoly.Locale, isoly.Date, string][])("format", (locale, date, formattedDate) => {
		expect(format(date, "date", locale)).toEqual(formattedDate)
	})
	it.each([
		["sv-SE", "2", "YYY-MM-DD"],
		["en-GB", "", "DD/MM/YYYY"],
		["en-GB", "3", "D/MM/YYYY"],
		["en-GB", "31/01/2024", ""],
		["en-US", "", "MM/DD/YYYY"],
		["en-US", "0", "M/DD/YYYY"],
		["en-US", "07/", "DD/YYYY"],
		["en-US", "07/04/177", "Y"],
		["en-US", "07/04/1776", ""],
	] as [isoly.Locale, string, string][])("formatRemaining", (locale, date, remainder) => {
		const handler = get("date", locale)
		expect(handler?.formattedRemainder(tidily.StateEditor.modify(date))).toEqual(remainder)
	})
})
