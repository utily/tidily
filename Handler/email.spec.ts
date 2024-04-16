import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { format, get } from "./index"

describe("email", () => {
	const handler = get("email") as Converter<"string" | unknown> & Formatter
	it("format", () => {
		expect(format("hello@world.com", "email", { pattern: /.*@.*/ })).toEqual("hello@world.com")
	})
	it("toString", () => {
		expect(handler.toString(undefined)).toEqual("")
	})
	it("fromString", () => {
		expect(handler.fromString("")).toEqual(undefined)
	})
})
