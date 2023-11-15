import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("duration", () => {
	const handler = get("duration") as Formatter
	it("Key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1 h", selection: { start: 1, end: 1 } })
	})
	it("1: + 1 => 1:1", () => {
		const result = Action.apply(handler, { value: "1:", selection: { start: 2, end: 2 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1:1 h", selection: { start: 3, end: 3 } })
	})
	it("12: + 3 => 12:3", () => {
		const result = Action.apply(handler, { value: "12:", selection: { start: 3, end: 3 } }, { key: "3" })
		expect(result).toMatchObject({ value: "12:3 h", selection: { start: 4, end: 4 } })
	})
	it("Add too many minutes", () => {
		const result = Action.apply(handler, { value: "12:23", selection: { start: 5, end: 5 } }, { key: "3" })
		expect(result).toMatchObject({ value: "12:23 h", selection: { start: 5, end: 5 } })
	})
	it("Add 60 minutes", () => {
		const result = Action.apply(handler, { value: "12:6", selection: { start: 4, end: 4 } }, { key: "0" })
		expect(result).toMatchObject({ value: "12:6 h", selection: { start: 4, end: 4 } })
	})
	it("Key event backspace", () => {
		let result = { value: "12:34", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "12:3 h", selection: { start: 4, end: 4 } })
	})
	it("Add letter", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		result = Action.apply(handler, result, { key: "f" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
})
