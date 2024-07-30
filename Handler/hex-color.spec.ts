import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("hex-color", () => {
	const handler = get("hex-color") as Converter<string | unknown> & Formatter
	it("key event first key 0", () => {
		const zeroPressedState = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "0" })
		expect(zeroPressedState).toMatchObject({ value: "#0", selection: { start: 2, end: 2 } })
	})
	it("too many chars", () => {
		const oneTooManyCharsState = Action.apply(
			handler,
			{ value: "#ffaaee", selection: { start: 2, end: 2 } },
			{ key: "f" }
		)
		expect(oneTooManyCharsState).toMatchObject({ value: "#ffaaee", selection: { start: 2, end: 2 } })
	})
})
