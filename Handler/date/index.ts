import * as isoly from "isoly"
import { Converter } from "../../Converter"
import { DateFormat } from "../../DateFormat"
import { Formatter } from "../../Formatter"
import { Settings } from "../../Settings"
import { State } from "../../State"
import { StateEditor } from "../../StateEditor"
import { add } from "../base"
import { validFormat } from "./helper"

class Handler implements Converter<string>, Formatter {
	formatting?: DateFormat
	locale: isoly.Locale | undefined
	constructor(formatting?: DateFormat | isoly.Locale) {
		this.formatting = DateFormat.is(formatting) ? formatting : DateFormat.fromLocale(formatting)
		this.locale = isoly.Locale.is(this.locale)
			? this.locale
			: DateFormat.is(formatting)
			? DateFormat.toLocale(formatting)
			: undefined
	}
	toString(data: isoly.Date | any): string {
		return typeof data != "string" ? "" : isoly.Date.is(data) ? isoly.Date.localize(data, this.locale) : data
	}
	fromString(value: string): isoly.Date | undefined {
		let result: isoly.Date | undefined
		switch (this.formatting) {
			case "dd/mm/YYYY":
			case "dd.mm.YYYY":
				result = `${value.substring(6, 10)}-${value.substring(3, 5)}-${value.substring(0, 2)}`
				break
			case "mm/dd/YYYY":
				result = `${value.substring(6, 10)}-${value.substring(0, 2)}-${value.substring(3, 5)}`
				break
			default:
				result = value
				break
		}
		return isoly.Date.is(result) ? result : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let result: Readonly<State> & Settings
		switch (this.formatting) {
			case "dd/mm/YYYY":
				result = {
					...formatDate(unformated, "dd/mm/YYYY"),
					type: "text",
					length: [0, 10],
					pattern: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
				}
				break
			case "dd.mm.YYYY":
				result = {
					...formatDate(unformated, "dd.mm.YYYY"),
					type: "text",
					length: [0, 10],
					pattern: /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/,
				}
				break
			case "mm/dd/YYYY":
				result = {
					...formatDate(unformated, "mm/dd/YYYY"),
					type: "text",
					length: [0, 10],
					pattern: /^(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/,
				}
				break
			default:
				result = {
					...formatDate(unformated),
					type: "text",
					length: [0, 10],
					pattern: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
				}
				break
		}
		return result
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return validFormat(symbol, state, this.formatting ?? "YYYY-mm-dd")
	}
}
add("date", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
export function formatDate(unformated: StateEditor, format?: DateFormat | isoly.Locale): StateEditor {
	let result = unformated
	switch (format) {
		case "dd/mm/YYYY":
		case "dd.mm.YYYY":
			result = autoDivider(result, format)
			if (unformated.value.length == 10) {
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
			}
			break
		case "mm/dd/YYYY":
			result = autoDivider(result, format)
			if (unformated.value.length == 10) {
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
			}
			break
		default:
			result = autoDivider(result, format)
			if (unformated.value.length == 10) {
				if (!validDate(result.value))
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
	}
	return result

	return unformated
}
function validDate(date: string, format?: DateFormat | isoly.Locale): boolean {
	let year: number
	let month: number
	let day: number
	let result: boolean
	switch (format) {
		case "dd/mm/YYYY":
		case "dd.mm.YYYY":
			year = parseInt(date.substring(6, 10))
			month = parseInt(date.substring(3, 5))
			day = parseInt(date.substring(0, 2))
			result = year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
			break
		case "mm/dd/YYYY":
			year = parseInt(date.substring(6, 10))
			month = parseInt(date.substring(0, 2))
			day = parseInt(date.substring(3, 5))
			result = year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
			break
		default:
			year = parseInt(date.substring(0, 4))
			month = parseInt(date.substring(5, 7))
			day = parseInt(date.substring(8, 10))
			result = year && month && day ? day > 0 && daysPerMonth(year, month) >= day : false
			break
	}
	return result
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
function autoDivider(result: StateEditor, format?: DateFormat | isoly.Locale) {
	switch (format) {
		case "mm/dd/YYYY":
		case "dd/mm/YYYY":
			if (result.value.length == 2)
				result = result.replace(0, 2, result.value.substring(0, 2) + "/")
			else if (result.value.length == 5)
				result = result.replace(0, 5, result.value.substring(0, 5) + "/")
			break
		case "dd.mm.YYYY":
			if (result.value.length == 2)
				result = result.replace(0, 2, result.value.substring(0, 2) + ".")
			else if (result.value.length == 5)
				result = result.replace(0, 5, result.value.substring(0, 5) + ".")
			break
		default:
			if (result.value.length == 4)
				result = result.replace(0, 4, result.value.substring(0, 4) + "-")
			else if (result.value.length == 7)
				result = result.replace(0, 7, result.value.substring(0, 7) + "-")
	}
	return result
}
