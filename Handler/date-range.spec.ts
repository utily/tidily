import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("date-range", () => {
	const handler = get("date-range") as Converter<string> & Formatter
	it("formats input", () => {
		expect(Action.apply(handler, { value: "202", selection: { start: 4, end: 4 } }, { key: "3" })).toMatchObject({
			value: "2023-",
			selection: { start: 6, end: 6 },
		})
		expect(Action.apply(handler, { value: "2023-0", selection: { start: 7, end: 7 } }, { key: "5" })).toMatchObject({
			value: "2023-05-",
			selection: { start: 9, end: 9 },
		})
		expect(
			Action.apply(handler, { value: "2023-05-2", selection: { start: 10, end: 10 } }, { key: "3" })
		).toMatchObject({
			value: "2023-05-23 - ",
			selection: { start: 14, end: 14 },
		})
		expect(
			Action.apply(handler, { value: "2023-05-23 - 202", selection: { start: 16, end: 16 } }, { key: "3" })
		).toMatchObject({
			value: "2023-05-23 - 2023-",
			selection: { start: 17, end: 17 },
		})
		expect(
			Action.apply(handler, { value: "2023-05-23 - 2023-0", selection: { start: 20, end: 20 } }, { key: "6" })
		).toMatchObject({
			value: "2023-05-23 - 2023-06-",
			selection: { start: 21, end: 21 },
		})
		expect(
			Action.apply(handler, { value: "2023-05-23 - 2023-06-2", selection: { start: 22, end: 22 } }, { key: "3" })
		).toMatchObject({
			value: "2023-05-23 - 2023-06-23",
			selection: { start: 23, end: 23 },
		})
		expect(
			Action.apply(handler, { value: "2023-05-23 - 2023-06-23", selection: { start: 24, end: 24 } }, { key: "5" })
		).toMatchObject({
			value: "2023-05-23 - 2023-06-23",
			selection: { start: 24, end: 24 },
		})
		// Try other direction
	})
})
