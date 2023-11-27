import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { format, get } from "./index"

describe("identity-number", () => {
	const handler = get("identity-number") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("add dash", () => {
		const result = Action.apply(handler, { value: "1985050", selection: { start: 7, end: 7 } }, { key: "5" })
		expect(result).toMatchObject({ value: "19850505-", selection: { start: 9, end: 9 } })
	})
	it("add century", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "85050512345")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "19850505-1234", selection: { start: 13, end: 13 } })
	})
	it("format", () => {
		expect(format("85050512345", "identity-number")).toEqual("19850505-1234")
	})
})
