import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("price", () => {
	const handler = get("price", "SEK") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1 SEK", selection: { start: 1, end: 1 } })
	})
	it("adds space", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234 SEK", selection: { start: 5, end: 5 } })
	})
	it("adds spaces", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234567")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 234 567 SEK", selection: { start: 9, end: 9 } })
	})
	it("allows decimal point", () => {
		const result = Action.apply(handler, { value: "1", selection: { start: 1, end: 1 } }, { key: "." })
		expect(result).toMatchObject({ value: "1. SEK", selection: { start: 2, end: 2 } })
	})
	it("allows only one decimal point", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of ".1.2")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: ".12 SEK", selection: { start: 3, end: 3 } })
	})
	it("truncates many decimals", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of ".123")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: ".12 SEK", selection: { start: 3, end: 3 } })
	})
})
