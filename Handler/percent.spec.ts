import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { StateEditor } from "../StateEditor"
import { get } from "./index"

describe("percent", () => {
	const handler = get("percent") as Converter<number | unknown> & Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1 %", selection: { start: 1, end: 1 } })
	})
	it("key event first key 0", () => {
		const zeroPressedState = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "0" })
		expect(zeroPressedState).toMatchObject({ value: "0 %", selection: { start: 1, end: 1 } })
		const backspaceState = Action.apply(handler, zeroPressedState, { key: "Backspace" })
		expect(backspaceState).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event letter", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "a" })
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
		expect(handler.toString(1)).toEqual("100")
		expect(handler.toString(0.14)).toEqual("14")
		expect(handler.toString(0.123456789)).toEqual("12.3456789")
		expect(handler.toString(0.5)).toEqual("50")
		expect(handler.toString(0.25)).toEqual("25")
		expect(handler.toString(0)).toEqual("0")
		expect(handler.toString(undefined)).toEqual("")
	})
	it("fromString", () => {
		expect(handler.fromString("100")).toEqual(1)
		expect(handler.fromString("14")).toEqual(0.14)
		expect(handler.fromString("50")).toEqual(0.5)
		expect(handler.fromString("50")).toEqual(0.5)
		expect(handler.fromString("25")).toEqual(0.25)
		expect(handler.fromString("0")).toEqual(0)
		expect(handler.fromString("")).toEqual(undefined)
	})
})
