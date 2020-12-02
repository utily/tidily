import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"
import { formatDate, stringToDate } from "./date"

class Handler implements Converter<string>, Formatter {
	toString(data: isoly.DateTime | any): string {
		return typeof data == "string" ? (isoly.DateTime.is(data) ? isoly.DateTime.localize(data) : data) : ""
	}
	fromString(value: string): isoly.DateTime | undefined {
		return stringToDate(value)
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let result = formatDate(unformated)
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[\d:.-]$/))
			result = result.insert(10, " ")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) 3$/))
			result = result.replace(11, 12, "23:")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) [45]$/))
			result = result.insert(11, "23:")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) [6-9]$/))
			result = result.insert(11, "23:5")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) 24$/))
			result = result.replace(10, 13, "00:")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) 25$/))
			result = result.insert(12, "3:")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) 2[6-9]$/))
			result = result.insert(12, "3:5").append(":")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([0-1]\d|2[0-3])\d[\s\S]$/))
			result = result.insert(13, ":")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([0-1]\d|2[0-3]):[6-9]$/))
			result = result.insert(14, "5")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([0-1]\d|2[0-3]):[0-5]\d\d$/))
			result = result.insert(16, ":")
		if (result.match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([0-1]\d|2[0-3]):[0-5]\d:[6-9]$/))
			result = result.insert(17, "5")
		return {
			...result,
			type: "text",
			length: [0, 19],
			pattern: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([0-1]\d|2[0-3])(:[0-5]\d){2}$/,
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			state.value.length < 19 &&
			((symbol >= "0" && symbol <= "9") || symbol == "-" || symbol == ":" || symbol == "." || symbol == " ")
		)
	}
}
add("date-time", () => new Handler())
