import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("card-expires", () => {
	const handler = get("card-expires") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event first key 2", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "2" })
		expect(result).toMatchObject({ value: "02 / ", selection: { start: 5, end: 5 } })
	})
	it("key event full expires", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "12 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event full expires short", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "02 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event full expires with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "12349999")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "12 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event backspace", () => {
		let result = { value: "12 / 34", selection: { start: 7, end: 7 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "12 / 3", selection: { start: 6, end: 6 } })
	})
	it("key event backspace past formatting character", () => {
		let result = { value: "12 / ", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
})
