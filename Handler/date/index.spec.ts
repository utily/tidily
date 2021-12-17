import { get } from "../index"

describe("Date handler", () => {
	const handler = { gb: get("date", "en-GB"), us: get("date", "en-US"), standard: get("date") }
	it("Date fromString", () => {
		expect(handler.gb?.fromString("31/12/2021")).toEqual("2021-12-31")
		expect(handler.us?.fromString("12/31/2021")).toEqual("2021-12-31")
		expect(handler.standard?.fromString("2021-12-31")).toEqual("2021-12-31")
	})
})
