import { tidily } from "../index"

describe("price", () => {
	it("adds decimals", () => {
		expect(tidily.format(212, "price", "USD")).toBe("212.00 USD")
		expect(tidily.format(212.0, "price", "USD")).toBe("212.00 USD")
	})
	it("does not add decimals", () => {
		expect(tidily.format(212, "price", "ISK")).toBe("212 ISK")
		expect(tidily.format(212.0, "price", "XPD")).toBe("212 XPD")
	})
	const handler = tidily.get("price", "SEK") as tidily.Converter<"string" | unknown> & tidily.Formatter
	const noCurrencyHandler = tidily.get("price") as tidily.Converter<"string" | unknown> & tidily.Formatter
	it("key event first key 1", () => {
		const result = tidily.Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1.00 SEK", selection: { start: 1, end: 1 } })
	})
	it("adds space", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234.00 SEK", selection: { start: 5, end: 5 } })
		expect(result.pattern?.test("1 234.00 SEK")).toEqual(true)
	})
	it("adds spaces", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234567")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234 567.00 SEK", selection: { start: 9, end: 9 } })
	})
	it("allows decimal point", () => {
		const result = tidily.Action.apply(handler, { value: "1", selection: { start: 1, end: 1 } }, { key: "." })
		expect(result).toMatchObject({ value: "1.00 SEK", selection: { start: 2, end: 2 } })
		expect(result.pattern?.test("1.00 SEK")).toEqual(true)
	})
	it("allows only one decimal point", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of ".1.2")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "0.12 SEK", selection: { start: 4, end: 4 } })
		expect(result.pattern?.test("0.12 SEK")).toEqual(true)
	})
	it("truncates many decimals", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of ".123")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "0.12 SEK", selection: { start: 4, end: 4 } })
	})
	it("doesn't add currency", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234")
			result = tidily.Action.apply(noCurrencyHandler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234", selection: { start: 5, end: 5 } })
		expect(result.pattern?.test("1 234")).toEqual(true)
	})
	it("format", () => {
		expect(tidily.format(133.7, "price", "SEK")).toEqual("133.70 SEK")
	})
	it("format from string", () => {
		expect(tidily.format("133.7", "price", "SEK")).toEqual("133.70 SEK")
	})
	it("format from empty string", () => {
		expect(tidily.format("", "price", "SEK")).toEqual("")
	})
	it('test for avoiding "0.00 SEK" -> "000 SEK"', () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		result = tidily.Action.apply(handler, result, { key: "." })
		expect(result).toMatchObject({ value: "0.00 SEK", selection: { start: 2, end: 2 } })
		result = tidily.Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "0 SEK", selection: { start: 1, end: 1 } })
		expect(result.pattern?.test("0 SEK")).toEqual(true)
	})
	it("toString", () => {
		expect(handler.toString(7111)).toEqual("7111")
		expect(handler.toString(undefined)).toEqual("")
		expect(noCurrencyHandler.toString(undefined)).toEqual("")
	})
	it("fromString", () => {
		expect(handler.fromString("07111")).toEqual(7111)
		expect(handler.fromString("")).toEqual(undefined)
		expect(noCurrencyHandler.fromString("")).toEqual(undefined)
	})
	it.each([
		["EUR", "1", "1 EUR", "1.00 EUR"],
		["EUR", "0", "0 EUR", "0 EUR"],
		["EUR", "0.1", "0.1 EUR", "0.10 EUR"],
		["EUR", "0.9", "0.9 EUR", "0.90 EUR"],
		["EUR", "9000", "9 000 EUR", "9 000.00 EUR"],
	])("format and partialFormat", (currency: string, data: string, partialFormatted: string, formatted: string) => {
		expect(tidily.partialFormat(data, "price", currency)).toEqual(partialFormatted)
		expect(tidily.format(data, "price", currency)).toEqual(formatted)
	})
})
