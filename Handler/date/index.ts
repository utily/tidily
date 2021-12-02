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
		return parse(value, this.formatting)
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let result: Readonly<State> & Settings
		switch (this.formatting) {
			case "dd/MM/YYYY":
				result = {
					...formatDate(unformated, "dd/MM/YYYY"),
					type: "text",
					length: [0, 10],
					pattern: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
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
		let result: boolean
		switch (this.formatting) {
			case "dd/MM/YYYY":
				result = validFormat(symbol, state, "dd/MM/YYYY")
				break
			default:
				result = validFormat(symbol, state)
				break
		}
		return result
	}
}
add("date", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
export function parse(value: string, formatting?: DateFormat | isoly.Locale): isoly.Date | undefined {
	let parts: string[]
	switch (formatting) {
		case "dd/MM/YYYY":
			parts = value.split("/").reverse()
			break
		default:
			parts = value.split("-")
			break
	}
	const result = parts.join("-")
	return isoly.Date.is(result) ? result : undefined
}
export function formatDate(unformated: StateEditor, format?: DateFormat | isoly.Locale): StateEditor {
	let result = unformated
	switch (format) {
		case "dd/MM/YYYY":
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
			console.log("running2", !validDate(result.value), result)
			break
	}
	return result
}
function validDate(date: string, format?: DateFormat | isoly.Locale): boolean {
	let year: number
	let month: number
	let day: number
	switch (format) {
		case "dd/MM/YYYY":
			year = parseInt(date.substring(6, 10))
			month = parseInt(date.substring(3, 5))
			day = parseInt(date.substring(0, 2))
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
