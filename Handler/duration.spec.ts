import { isoly } from "isoly"
import { Action } from "../Action"
import { StateEditor } from "../StateEditor"
import { format, get } from "./index"

describe("duration", () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const handler = get<isoly.TimeSpan>("duration")!
	it("format", () => {
		expect(format({ hours: 1, minutes: 30 }, "duration")).toEqual("1:30")
		expect(format({ hours: 1, minutes: 30 }, "duration")).toEqual("1:30")
		expect(handler.format(StateEditor.modify("0.12")).value).toEqual("0.12")
		expect(handler.format(StateEditor.modify("-0.12")).value).toEqual("-0.12")
		expect(handler.format(StateEditor.modify("-00.12")).value).toEqual("-0.12")
		expect(handler.format(StateEditor.modify("-001")).value).toEqual("-1")
		expect(handler.format(StateEditor.modify("-0")).value).toEqual("-0")
		expect(handler.format(StateEditor.modify("01")).value).toEqual("1")
		expect(handler.format(StateEditor.modify("000")).value).toEqual("0")
		expect(handler.format(StateEditor.modify("00")).value).toEqual("0")
		expect(handler.format(StateEditor.modify(",1")).value).toEqual("0,1")
		expect(handler.format(StateEditor.modify(".1")).value).toEqual("0.1")
		expect(handler.format(StateEditor.modify(":1")).value).toEqual("0:1")
		expect(handler.format(StateEditor.modify("-,1")).value).toEqual("-0,1")
		expect(handler.format(StateEditor.modify("-.1")).value).toEqual("-0.1")
		expect(handler.format(StateEditor.modify("-:1")).value).toEqual("-0:1")
		expect(handler.format(StateEditor.modify("0:03")).value).toEqual("0:03")
	})
	it("smoothly", () => {
		function smoothlyFormat(value: string) {
			return handler.format(
				StateEditor.copy(
					handler.unformat(
						StateEditor.copy({
							value: value,
							selection: { start: value.length, end: value.length, direction: "none" },
						})
					)
				)
			)
		}
		function smoothlyNewState(value: isoly.TimeSpan) {
			return smoothlyFormat(handler.toString(value))
		}
		expect(smoothlyFormat("0:03").value).toEqual("0:03")
		expect(smoothlyNewState({ hours: 30 }).value).toEqual("30")
		expect(smoothlyNewState({ minutes: 30 }).value).toEqual("0:30")
		expect(smoothlyNewState({ hours: 30, minutes: 30 }).value).toEqual("30:30")
		expect(smoothlyNewState({ hours: -30, minutes: 30 }).value).toEqual("-29:30")
		expect(smoothlyNewState({ hours: 30, minutes: -30 }).value).toEqual("29:30")
		expect(smoothlyNewState({ hours: -30, minutes: -30 }).value).toEqual("-30:30")
	})
	it("Key event first key 1", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("1: + 1 => 1:1", () => {
		const result = Action.apply(handler, { value: "1:", selection: { start: 2, end: 2 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1:1", selection: { start: 3, end: 3 } })
	})
	it("12: + 3 => 12:3", () => {
		const result = Action.apply(handler, { value: "12:", selection: { start: 3, end: 3 } }, { key: "3" })
		expect(result).toMatchObject({ value: "12:3", selection: { start: 4, end: 4 } })
	})
	it("Add too many minutes", () => {
		const result = Action.apply(handler, { value: "12:23", selection: { start: 5, end: 5 } }, { key: "3" })
		expect(result).toMatchObject({ value: "12:23", selection: { start: 5, end: 5 } })
	})
	it("Add 60 minutes", () => {
		const result = Action.apply(handler, { value: "12:6", selection: { start: 4, end: 4 } }, { key: "0" })
		expect(result).toMatchObject({ value: "12:6", selection: { start: 4, end: 4 } })
	})
	it("Key event backspace", () => {
		let result = { value: "12:34", selection: { start: 5, end: 5 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "12:3", selection: { start: 4, end: 4 } })
	})
	it("Add letter", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		result = Action.apply(handler, result, { key: "f" })
		expect(result).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("starting with :", () => {
		let result = { value: "", selection: { start: 1, end: 1 } }
		result = Action.apply(handler, result, { key: ":" })
		expect(result).toMatchObject({ value: "0:", selection: { start: 3, end: 3 } })
	})
	it("toString", () => {
		expect(handler.toString({})).toEqual("")
		expect(handler.toString({ hours: 25 })).toEqual("25")
		expect(handler.toString({ minutes: 30 })).toEqual("0:30")
		expect(handler.toString({ minutes: 3 })).toEqual("0:3")
		expect(handler.toString({ hours: 8, minutes: 5 })).toEqual("8:5")
	})
	it("fromString", () => {
		expect(handler.fromString("0:0")).toEqual({})
		expect(handler.fromString("")).toEqual({})
		expect(handler.fromString(":")).toEqual({})
		expect(handler.fromString(":0")).toEqual({})
		expect(handler.fromString("0")).toEqual({})
		expect(handler.fromString("3:30")).toEqual({ hours: 3, minutes: 30 })
		expect(handler.fromString("3:3")).toEqual({ hours: 3, minutes: 3 })
		expect(handler.fromString("1,5")).toEqual({ hours: 1, minutes: 30 })
		expect(handler.fromString("-1,5")).toEqual({ hours: -1, minutes: -30 })
		expect(handler.fromString("1.5")).toEqual({ hours: 1, minutes: 30 })
		expect(handler.fromString("-1.5")).toEqual({ hours: -1, minutes: -30 })
	})
})
