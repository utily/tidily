import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { StateEditor } from "../StateEditor"
import { get } from "./index"

describe("percent", () => {
	const handler = get("percent") as Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1 %", selection: { start: 1, end: 1 } })
	})
	it("key event letter", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "a" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
})
