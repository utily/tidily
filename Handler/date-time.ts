import * as isoly from "isoly"
import { Converter } from "../Converter"
import { DateFormat } from "../DateFormat"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data?: isoly.DateTime | unknown): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): isoly.DateTime | undefined {
		let result: string | isoly.DateTime | undefined = value.replace(" ", "T")
		const fillerDate = "0000-01-01T00:00:00.000Z"
		if (result?.match(/-\d$/))
			result = result.substring(0, result.length - 1) + "0" + result.substring(result.length - 1, result.length)
		result = !result.match(/^\d{4}-(0[1-9]|1[012])/)
			? undefined
			: result + fillerDate.substring(result.length, fillerDate.length)
		return isoly.DateTime.is(result) ? result : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = formatDate(unformatted)
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
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			state.value.length < 19 &&
			((symbol >= "0" && symbol <= "9") || symbol == "-" || symbol == ":" || symbol == "." || symbol == " ")
		)
	}
}
add("date-time", () => new Handler())

export function formatDate(unformatted: StateEditor, format?: DateFormat | isoly.Locale): StateEditor {
	let result = unformatted
	switch (format) {
		case "dd/mm/YYYY":
		case "dd.mm.YYYY":
			if (!validDate(result.value, format))
				result = result.replace(
					0,
					10,
					validDate("31" + result.value.substring(2, 10), format)
						? "31" + result.value.substring(2, 10)
						: validDate("30" + result.value.substring(2, 10), format)
						? "30" + result.value.substring(2, 10)
						: validDate("29" + result.value.substring(2, 10), format)
						? "29" + result.value.substring(2, 10)
						: validDate("28" + result.value.substring(2, 10), format)
						? "28" + result.value.substring(2, 10)
						: result.value
				)

			break
		case "mm/dd/YYYY":
			if (!validDate(result.value, format))
				result = result.replace(
					0,
					10,
					validDate(result.value.substring(0, 3) + "31" + result.value.substring(5, 10), format)
						? result.value.substring(0, 3) + "31" + result.value.substring(5, 10)
						: validDate(result.value.substring(0, 3) + "30" + result.value.substring(5, 10), format)
						? result.value.substring(0, 3) + "30" + result.value.substring(5, 10)
						: validDate(result.value.substring(0, 3) + "29" + result.value.substring(5, 10), format)
						? result.value.substring(0, 3) + "29" + result.value.substring(5, 10)
						: validDate(result.value.substring(0, 3) + "28" + result.value.substring(5, 10), format)
						? result.value.substring(0, 3) + "28" + result.value.substring(5, 10)
						: result.value
				)

			break
		default:
			if (unformatted.value.length == 10) {
				if (!validDate(result.value)) {
					result = result.replace(
						0,
						10,
						validDate(result.value.substring(0, 8) + "31")
							? result.value.substring(0, 8) + "31"
							: validDate(result.value.substring(0, 8) + "30")
							? result.value.substring(0, 8) + "30"
							: validDate(result.value.substring(0, 8) + "29")
							? result.value.substring(0, 8) + "29"
							: validDate(result.value.substring(0, 8) + "28")
							? result.value.substring(0, 8) + "28"
							: result.value
					)
					break
				}
				return unformatted
			}
	}
	return result
}
function validDate(date: string, format?: DateFormat | isoly.Locale): boolean {
	let year: number
	let month: number
	let day: number
	switch (format) {
		case "dd/mm/YYYY":
		case "dd.mm.YYYY":
			year = parseInt(date.substring(6, 10))
			month = parseInt(date.substring(3, 5))
			day = parseInt(date.substring(0, 2))
			return year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
		case "mm/dd/YYYY":
			year = parseInt(date.substring(6, 10))
			month = parseInt(date.substring(0, 2))
			day = parseInt(date.substring(3, 5))
			return year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
		default:
			year = parseInt(date.substring(0, 4))
			month = parseInt(date.substring(5, 7))
			day = parseInt(date.substring(8, 10))
			return year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
	}
}
function daysPerMonth(year: number, month: number): 28 | 29 | 30 | 31 {
	let result: 28 | 29 | 30 | 31
	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
		default:
			result = 31
			break
		case 4:
		case 6:
		case 9:
		case 11:
			result = 30
			break
		case 2:
			result = 28
			break
	}
	return result
}
