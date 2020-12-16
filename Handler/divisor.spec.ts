import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("divisor", () => {
	const handler = get("divisor") as Converter<number | [number, number]> & Formatter
	it("key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event full divisor #1", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1234")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "12 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event full divisor #2", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "1/4")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "1 / 4", selection: { start: 5, end: 5 } })
	})
	it("key event full expires short", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "2/34")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "2 / 34", selection: { start: 6, end: 6 } })
	})
	it("key event full expires short #2", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "23/4")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "23 / 4", selection: { start: 6, end: 6 } })
	})
	it("key event full expires with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "12349999")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "12 / 34", selection: { start: 7, end: 7 } })
	})
	it("key event backspace", () => {
		let result = { value: "12 / 34", selection: { start: 7, end: 7 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "12 / 3", selection: { start: 6, end: 6 } })
	})
	it("key event backspace #2", () => {
		let result = { value: "11 / 2", selection: { start: 6, end: 6 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "11 / ", selection: { start: 5, end: 5 } })
	})
	it("key event backspace #4", () => {
		let result = { value: "11  / ", selection: { start: 6, end: 6 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "11", selection: { start: 2, end: 2 } })
	})
	it("key event backspace #5", () => {
		let result = { value: "1  / ", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event space", () => {
		let result = { value: " ", selection: { start: 1, end: 1 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event slash", () => {
		let result = { value: "/", selection: { start: 1, end: 1 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event weird input", () => {
		let result = { value: "  / ", selection: { start: 4, end: 4 } }
		result = Action.apply(handler, result, { key: "2" })
		expect(result).toMatchObject({ value: "2", selection: { start: 1, end: 1 } })
	})
	it("key event weird input #2", () => {
		let result = { value: "  / ", selection: { start: 4, end: 4 } }
		result = Action.apply(handler, result, { key: "/" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("key event no extra space please", () => {
		let result = { value: "1 ", selection: { start: 2, end: 2 } }
		result = Action.apply(handler, result, { key: "/" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("key event no extra space please #2", () => {
		let result = { value: "1", selection: { start: 1, end: 1 } }
		result = Action.apply(handler, result, { key: " " })
		expect(result).toMatchObject({ value: "1 / ", selection: { start: 4, end: 4 } })
	})
	it("key event not three digits as end of divisor", () => {
		let result = { value: "1 / 23", selection: { start: 6, end: 6 } }
		result = Action.apply(handler, result, { key: "4" })
		expect(result).toMatchObject({ value: "1 / 23", selection: { start: 6, end: 6 } })
	})
	it("fromString() tests", () => {
		expect(handler.fromString("1 / 2")).toEqual([1, 2])
		expect(handler.fromString("1 / 23")).toEqual([1, 23])
		expect(handler.fromString("12 / 34")).toEqual([12, 34])
		expect(handler.fromString("1")).toEqual(1)
		expect(handler.fromString("12")).toEqual(12)
		expect(handler.fromString("  12  ")).toEqual(12)
	})
	it("toString() tests", () => {
		expect(handler.toString([1, 2])).toEqual("1 / 2")
		expect(handler.toString([1, 23])).toEqual("1 / 23")
		expect(handler.toString([12, 34])).toEqual("12 / 34")
		expect(handler.toString(1)).toEqual("1")
		expect(handler.toString(12)).toEqual("12")
	})
})
