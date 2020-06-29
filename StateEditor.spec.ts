import { StateEditor } from "./StateEditor"

describe("StateEditor", () => {
	it("create", () => {
		expect(StateEditor.create()).toMatchObject({ value: "", selection: { start: 0, end: 0 } })
	})
	it("is", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.is(0, "a")).toEqual(true)
	})
	it("isDigit", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.isDigit(0)).toEqual(false)
	})
	it("match", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.match(/^[ba]{2}cd.*$/)?.length).toEqual(1)
	})
	it("insert", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.insert(0, "0")).toMatchObject({ value: "0abcdefg", selection: { start: 4, end: 5 } })
	})
	it("prepend", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.prepend("pre")).toMatchObject({ value: "preabcdefg", selection: { start: 6, end: 7 } })
	})
	it("append", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } })
		expect(state.append("post")).toMatchObject({ value: "abcdefgpost", selection: { start: 3, end: 4 } })
	})
	it("append selection at end", () => {
		const state = StateEditor.modify({ value: "abcdefg", selection: { start: 7, end: 7 } })
		expect(state.append("post")).toMatchObject({ value: "abcdefgpost", selection: { start: 11, end: 11 } })
	})
	it("replace before selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } }).replace(2, 3, "0")
		expect(result.value).toEqual("ab0defg")
		expect(result.selection.start).toEqual(3)
		expect(result.selection.end).toEqual(4)
	})
	it("replace after selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } }).replace(4, 6, "0")
		expect(result.value).toEqual("abcd0g")
		expect(result.selection.start).toEqual(3)
		expect(result.selection.end).toEqual(4)
	})
	it("replace in selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } }).replace(3, 5, "0")
		expect(result.value).toEqual("abc0fg")
		expect(result.selection.start).toEqual(3)
		expect(result.selection.end).toEqual(4)
	})
	it("replace overlaps selection start", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 5 } }).replace(2, 4, "0")
		expect(result.value).toEqual("ab0efg")
		expect(result.selection.start).toEqual(3)
		expect(result.selection.end).toEqual(4)
	})
	it("replace overlaps selection end", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 2, end: 5 } }).replace(3, 6, "0")
		expect(result.value).toEqual("abc0g")
		expect(result.selection.start).toEqual(2)
		expect(result.selection.end).toEqual(4)
	})
	it("replace string", () => {
		const result = StateEditor.modify({ value: "abcdefgcd", selection: { start: 3, end: 4 } }).replace("cd", "0")
		expect(result.value).toEqual("ab0efg0")
		expect(result.selection.start).toEqual(3)
		expect(result.selection.end).toEqual(3)
	})
	it("delete", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 4 } }).delete(0, 2)
		expect(result.value).toEqual("cdefg")
		expect(result.selection.start).toEqual(1)
		expect(result.selection.end).toEqual(2)
	})
	it("delete one argument", () => {
		const result = StateEditor.modify({ value: "abcdefg", selection: { start: 3, end: 3 } }).delete(2)
		expect(result.value).toEqual("abdefg")
		expect(result.selection.start).toEqual(2)
		expect(result.selection.end).toEqual(2)
	})
	it("delete string", () => {
		const result = StateEditor.modify({ value: "abcdefcdg", selection: { start: 3, end: 3 } }).delete("cd")
		expect(result.value).toEqual("abefg")
		expect(result.selection.start).toEqual(2)
		expect(result.selection.end).toEqual(2)
	})
})
