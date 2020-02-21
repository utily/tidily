import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("phone", () => {
	const handler = get("phone") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("adds country code", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "08")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "+468-", selection: { start: 5, end: 5 } })
	})
	it("adds country code and keeps rest of number", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "0812345678")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "+468-123 456 78", selection: { start: 15, end: 15 } })
	})
	it("formats whole number", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "0812345678")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "+468-123 456 78", selection: { start: 15, end: 15 } })
	})
	it("key event backspace", () => {
		let result = { value: "+46812", selection: { start: 6, end: 6 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "+468-1", selection: { start: 6, end: 6 } })
	})
	it("key event backspace beyond area code", () => {
		let result = { value: "+468", selection: { start: 4, end: 4 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "+46", selection: { start: 3, end: 3 } })
	})
})
