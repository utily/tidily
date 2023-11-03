import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("duration", () => {
	const handler = get("duration") as Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("1: + 1 => 1:1", () => {
		const result = Action.apply(handler, { value: "1:", selection: { start: 2, end: 2 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1:1", selection: { start: 3, end: 3 } })
	})
})
