import { tidily } from "index"
import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { StateEditor } from "../StateEditor"
import { get } from "./index"

describe("percent", () => {
	const handler = get("integer") as Converter<number | unknown> & Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event first key 0", () => {
		const zeroPressedState = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "0" })
		expect(zeroPressedState).toMatchObject({ value: "0", selection: { start: 1, end: 1 } })
		const backspaceState = Action.apply(handler, zeroPressedState, { key: "Backspace" })
		expect(backspaceState).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event letter", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "a" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event symbol", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "." })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("deletes with empty value", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "Delete" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("unformats empty value", () => {
		const result = handler.unformat(StateEditor.copy({ value: "", selection: { start: 0, end: 0 } }))
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("doesn't add suffix on empty", () => {
		const result = handler.format(StateEditor.copy({ value: "", selection: { start: 0, end: 0 } }))
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("toString", () => {
		expect(handler.toString(1)).toEqual("1")
		expect(handler.toString(9999)).toEqual("9999")
		expect(handler.toString(0)).toEqual("0")
		expect(handler.toString(undefined)).toEqual("")
	})
	it("fromString", () => {
		expect(handler.fromString("100")).toEqual(100)
		expect(handler.fromString("50")).toEqual(50)
		expect(handler.fromString("25")).toEqual(25)
		expect(handler.fromString("0.5")).toEqual(0)
		expect(handler.fromString("0")).toEqual(0)
		expect(handler.fromString("")).toEqual(undefined)
	})
	it.each([
		[undefined, "15", undefined, "15"],
		[10, "15", undefined, "15"],
		[10, "8", undefined, "10"],
		[undefined, "15", 20, "15"],
		[undefined, "25", 20, "20"],
		[10, "15", 20, "15"],
		[10, "8", 20, "10"],
		[10, "30", 20, "20"],
	])(
		"Min-max options %s ≤ %s ≤ %s --> %s",
		(min: number | undefined, data: string, max: number | undefined, formattedValue: string) => {
			const handler = tidily.get("integer", { min, max }) as tidily.Converter<"string" | unknown> & tidily.Formatter
			const partialFormattedState = handler.partialFormat(tidily.StateEditor.modify(data))
			expect(partialFormattedState.value).toEqual(data)
			expect(tidily.format(data, "integer", { min, max })).toEqual(formattedValue)
		}
	)
	it.each([
		["15", undefined, "15"],
		["15", 3, "015"],
		["8", 3, "008"],
		["15", 0, "15"],
		["5", 2, "05"],
		["0", 2, "00"],
		["", 2, ""],
	])(
		"padToLength options %s.padToLength(%s) -.> %s",
		(data: string | undefined, padToLength: number | undefined, formattedValue: string) => {
			const handler = tidily.get("integer", { padToLength }) as tidily.Converter<"string" | unknown> & tidily.Formatter
			const partialFormattedState = handler.partialFormat(tidily.StateEditor.modify(data))
			expect(partialFormattedState.value).toEqual(data)
			expect(tidily.format(data, "integer", { padToLength })).toEqual(formattedValue)
		}
	)
})
