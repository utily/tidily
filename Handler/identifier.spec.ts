import { Action } from "../Action"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("identifier", () => {
	const codeHandler = get("identifier-code") as Formatter
	it("sentence to code", () => {
		const result = Action.apply(codeHandler, { value: "Lille John och -robin h00d", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "lillejohnochrobinh00d", selection: { start: 0, end: 0 } })
	})
	const camelHandler = get("identifier-camel") as Formatter
	it("sentence to camel", () => {
		const result = Action.apply(camelHandler, { value: "Lille John och -robin h00d", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "lilleJohnOchRobinH00d", selection: { start: 0, end: 0 } })
	})
	const pascalHandler = get("identifier-pascal") as Formatter
	it("sentence to pascal", () => {
		const result = Action.apply(pascalHandler, { value: "La Be Ro", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "LaBeRo", selection: { start: 0, end: 0 } })
	})
	it("snake to pascal", () => {
		const result = Action.apply(pascalHandler, { value: "foo_bar_baz", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "FooBarBaz", selection: { start: 0, end: 0 } })
	})
	const snakeHandler = get("identifier-snake") as Formatter
	it("pascal to snake", () => {
		const result = Action.apply(snakeHandler, { value: "FooBarBaz", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "foo_bar_baz", selection: { start: 0, end: 0 } })
	})
	it("attribute to snake", () => {
		const result = Action.apply(snakeHandler, { value: "foo-bar-baz", selection: { start: 0, end: 0 } })
		expect(result).toMatchObject({ value: "foo_bar_baz", selection: { start: 0, end: 0 } })
	})
	const attributeHandler = get("identifier-attribute") as Formatter
	it("pascal to attribute", () => {
		const result = Action.apply(attributeHandler, {
			value: "Lille John och -robin h00d",
			selection: { start: 0, end: 0 },
		})
		expect(result).toMatchObject({ value: "lille-john-och-robin-h00d", selection: { start: 0, end: 0 } })
	})
})
