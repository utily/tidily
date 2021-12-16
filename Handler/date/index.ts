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
	constructor(formatting?: DateFormat | isoly.Locale) {
		this.formatting = DateFormat.is(formatting) ? formatting : DateFormat.fromLocale(formatting)
	}
	toString(data: isoly.Date | any): string {
		return typeof data != "string" ? "" : isoly.Date.is(data) ? isoly.Date.localize(data, this.formatting) : data
	}
	fromString(value: string): isoly.Date | undefined {
		return isoly.Date.is(value) ? value : undefined
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
	if (unformated.selection.start >= 10) {
		let result = unformated
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
		return result
	}
	return unformated
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
