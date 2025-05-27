import { tidily } from "../index"

describe("tidily.number", () => {
	it("adds decimals", () => {
		expect(tidily.format(212, "number", 2)).toBe("212.00")
		expect(tidily.format(212.0, "number", 2)).toBe("212.00")
	})
	it("does not add decimals", () => {
		expect(tidily.format(212, "number", 0)).toBe("212")
		expect(tidily.format(212.0, "number", undefined)).toBe("212")
	})
	const handler = tidily.get("number", 2) as tidily.Converter<"string" | unknown> & tidily.Formatter
	const noCurrencyHandler = tidily.get("number") as tidily.Converter<"string" | unknown> & tidily.Formatter
	it("key event first key 1", () => {
		const result = tidily.Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1.00", selection: { start: 1, end: 1 } })
	})
	it("adds space", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234.00", selection: { start: 5, end: 5 } })
		expect(result.pattern?.test("1 234.00")).toEqual(true)
	})
	it("adds spaces", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234567")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234 567.00", selection: { start: 9, end: 9 } })
	})
	it("allows decimal point", () => {
		const result = tidily.Action.apply(handler, { value: "1", selection: { start: 1, end: 1 } }, { key: "." })
		expect(result).toMatchObject({ value: "1.00", selection: { start: 2, end: 2 } })
		expect(result.pattern?.test("1.00")).toEqual(true)
	})
	it("allows only one decimal point", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of ".1.2")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "0.12", selection: { start: 4, end: 4 } })
		expect(result.pattern?.test("0.12")).toEqual(true)
	})
	it("truncates many decimals", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of ".123")
			result = tidily.Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "0.12", selection: { start: 4, end: 4 } })
	})
	it("doesn't add currency", () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		for (const character of "1234")
			result = tidily.Action.apply(noCurrencyHandler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234", selection: { start: 5, end: 5 } })
		expect(result.pattern?.test("1 234")).toEqual(true)
	})
	it("format", () => {
		expect(tidily.format(133.7, "number", 2)).toEqual("133.70")
	})
	it("format from string", () => {
		expect(tidily.format("133.7", "number", 2)).toEqual("133.70")
	})
	it("format from empty string", () => {
		expect(tidily.format("", "number", 2)).toEqual("")
	})
	it.each([
		[2, 1, "1.00"],
		[0, 1, "1"],
		[2, 1.5, "1.50"],
		[0, 1.5, "1.50"],
		[2, 0, "0.00"],
		[0, 0, "0"],
		[2, undefined, ""],
		[0, undefined, ""],
	])("format decimals", (precision: number | undefined, value: number | undefined, formatted: string) => {
		expect(tidily.format(value, "number", precision)).toEqual(formatted)
	})
	it('test for avoiding "0.00" -> "000"', () => {
		let result: tidily.State & tidily.Settings = { value: "", selection: { start: 0, end: 0 }, type: "text" }
		result = tidily.Action.apply(handler, result, { key: "." })
		expect(result).toMatchObject({ value: "0.00", selection: { start: 2, end: 2 } })
		result = tidily.Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "0.00", selection: { start: 1, end: 1 } })
		expect(result.pattern?.test("0")).toEqual(true)
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
		[2, "1", "1", ".00"],
		[0, "1", "1", ""],
		[2, "0", "0", ".00"],
		[0, "0", "0", ""],
		[2, "0.1", "0.1", "0"],
		[0, "0.1", "0.1", "0"],
		[2, "0.200", "0.20", ""],
		[0, "0.200", "0.20", ""],
		[2, "0.30", "0.30", ""],
		[0, "0.30", "0.30", ""],
		[2, "0.418", "0.41", ""],
		[0, "0.418", "0.41", ""],
		[2, "0.9", "0.9", "0"],
		[0, "0.9", "0.9", "0"],
		[2, "9000", "9 000", ".00"],
		[0, "9000", "9 000", ""],
	] as const)(
		"partialFormat, remainder and fully formatted %i, %s, %s, %s",
		(precision: number, data: string, partialFormattedString: string, remainder: string) => {
			const handler = tidily.get("number", precision) as tidily.Converter<"string" | unknown> & tidily.Formatter
			const partialFormattedState = handler.partialFormat(tidily.StateEditor.modify(data))
			expect(partialFormattedState.value).toEqual(partialFormattedString)
			expect(partialFormattedState.remainder).toEqual(remainder)
			expect(tidily.format(data, "number", precision)).toEqual(partialFormattedString + remainder)
		}
	)
})
