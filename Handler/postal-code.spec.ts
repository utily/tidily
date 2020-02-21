import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("postal-code", () => {
	const handler = get("postal-code") as Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event inserts space", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "123 4", selection: { start: 5, end: 5 } })
	})
	it("key event full postal code", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "12345")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "123 45", selection: { start: 6, end: 6 } })
	})
	it("key event backspace", () => {
		let result = { value: "123 45", selection: { start: 6, end: 6 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "123 4", selection: { start: 5, end: 5 } })
	})
	it("key event backspace past formatting character", () => {
		let result = { value: "123 4", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "123", selection: { start: 3, end: 3 } })
	})
})
