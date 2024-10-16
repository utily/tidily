import { Action } from "../Action"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { get } from "./index"

describe("card-number", () => {
	const handler = get("card-number") as Converter<"string" | unknown> & Formatter
	it("key event first key", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "1" })
		expect(result).toMatchObject({ value: "1", selection: { start: 1, end: 1 } })
	})
	it("Dont format with extra space", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "42424242")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "4242 4242", selection: { start: 9, end: 9 } })
	})
	it("key event full visa number", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "4242424242424242")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } })
	})
	it("key event full visa number with extra chars", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "4242 424a 2424(242429999")
			result = Action.apply(handler, result, { key: character })
		expect(result).toMatchObject({ value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } })
	})
	it("key event backspace", () => {
		let result = { value: "4242 4242 4242 4242", selection: { start: 19, end: 19 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "4242 4242 4242 424", selection: { start: 18, end: 18 } })
	})
	it("key event backspace past formatting character", () => {
		let result = { value: "4242 4242 4242 ", selection: { start: 15, end: 15 } }
		result = Action.apply(handler, result, { key: "Backspace" })
		expect(result).toMatchObject({ value: "4242 4242 424", selection: { start: 13, end: 13 } })
	})
	it("matches amex format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "344242424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^3[47][0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{3}$/)
	})
	it("matches dankort format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "501942424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^(5019)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
	})
	it("matches diners format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "3804123456789011111111111")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^3(?:0[0-5]|[68][0-9])[0-9]\s[0-9]{6}\s[0-9]{4}$/)
		expect(result.value).toEqual("3804 123456 7890")
	})
	it("matches discover format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "601142424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^6(?:011|5[0-9]{2})\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
	})
	it("matches electron format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "440542424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(
			/^((4026|4405|4508|4844|4913|4917)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|((4175)\s(00)[0-9]{2}\s[0-9]{4}\s[0-9]{4})$/
		)
	})
	it("matches interpayment format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "636042424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^(636)[0-9]\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
	})
	it("matches jcb format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "350042424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(
			/^((?:2131|1800)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|(35[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})$/
		)
	})
	it("matches unionpay format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "880042424242424999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^(62|88)[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
	})
	it("matches maestro format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "5020345123451234999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(
			/^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/
		)
	})
	it("matches mastercard format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "5212345123451234999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^5[1-5][0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
	})
	it("matches VISA format", () => {
		let result = { value: "", selection: { start: 0, end: 0 } }
		for (const character of "4242424242424242999")
			result = Action.apply(handler, result, { key: character })
		expect(result.value).toMatch(/^4[0-9]{3}\s[0-9]{4}\s[0-9]{4}\s[0-9](?:[0-9]{3})?$/)
	})
	it("toString", () => {
		expect(handler.toString(undefined)).toEqual("")
	})
	it("fromString", () => {
		expect(handler.fromString("")).toEqual(undefined)
	})
})
