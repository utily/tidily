import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("divisor", () => {
	const handler = get("divisor") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event full divisor #1", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "12 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event full divisor #2", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1/4")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 / 4", selection: { start: 5, end: 5 } })
	})
	it("key event full expires short", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "2/34")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "2 / 34", selection: { start: 6, end: 6 } })
	})
	it("key event full expires short #2", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "23/4")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "23 / 4", selection: { start: 6, end: 6 } })
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
		let result = { value: "12 /", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "12 /", selection: { start: 4, end: 4 } })
	})
	it("key event space", () => {
		let result = { value: " ", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "", selection: { start: 3, end: 3 } })
	})
	it("key event slash", () => {
		let result = { value: "/", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "", selection: { start: 3, end: 3 } })
	})
})
