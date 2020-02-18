import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("card-number", () => {
	const handler = get("card-number") as Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event full visa number", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "4242424242424242")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } })
	})
	it("key event full visa number with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "4242 424a 2424(242429999")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } })
	})
	it("key event backspace", () => {
		let result = { value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "4242 4242 4242 424", selection: { start: 18, end: 18 } })
	})
	it("key event backspace past formatting character", () => {
		let result = { value: "4242 4242 4242 ", selection: { start: 15, end: 15 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "4242 4242 424", selection: { start: 13, end: 13 } })
	})
})
