import { Action } from "../../Action"
import { get } from "../index"

describe("Date handler", () => {
	const handlers = { gb: get("date", "en-GB"), us: get("date", "en-US"), standard: get("date") }
	it("Date fromString", () => {
		expect(handlers.gb?.fromString("31/12/2021")).toEqual("2021-12-31")
		expect(handlers.us?.fromString("12/31/2021")).toEqual("2021-12-31")
		expect(handlers.standard?.fromString("2021-12-31")).toEqual("2021-12-31")
	})
	it("key event full date with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1230202012")
			result = Action.apply(handlers.us, result, { key: character })
		expect(result).toMatchObject({ value: "12/30/2020", selection: { start: 10, end: 10 } })
	})
})
