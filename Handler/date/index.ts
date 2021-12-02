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
	constructor(readonly formatting?: DateFormat | isoly.Locale) {}
	toString(data: isoly.Date | any): string {
		return typeof data == "string" ? (isoly.Date.is(data) ? isoly.Date.localize(data, this.formatting) : data) : ""
	}
	fromString(value: string): isoly.Date | undefined {
		return isoly.Date.is(value) ? value : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let result: Readonly<State> & Settings
		const splitted = unformated.split("-")
		while (splitted.length < 3)
			splitted.push({ value: "", selection: {} })
		switch (this.formatting) {
			case "dd/MM/YYYY":
				result = {
					...State.merge(splitted[2], "/", splitted[1], "/", splitted[0]),
					type: "text",
					length: [0, 10],
					pattern: /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/,
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
		let result: State
		switch (this.formatting) {
			case "dd/MM/YYYY":
				const splitted = formated.split("/")
				while (splitted.length < 3)
					splitted.push({ value: "", selection: {} })
				result = State.merge(splitted[2], "-", splitted[1], "-", splitted[0])
				break
			default:
				result = formated
				break
		}
		return result
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		let format = this.formatting
		if (!DateFormat.is(format))
			format = DateFormat.fromLocale(format)
		let result: boolean
		switch (format) {
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

export function formatDate(unformated: StateEditor, format?: DateFormat | isoly.Locale): StateEditor {
	let result = unformated
	switch (format) {
		case "dd/MM/YYYY":
			if (!validDate(result.value))
				result = result.replace(
					0,
					10,
					validDate("31" + result.value.substring(2, 10))
						? "31" + result.value.substring(2, 10)
						: validDate("30" + result.value.substring(2, 10))
						? "30" + result.value.substring(2, 10)
						: validDate("29" + result.value.substring(2, 10))
						? "29" + result.value.substring(2, 10)
						: validDate("28" + result.value.substring(2, 10))
						? "28" + result.value.substring(2, 10)
						: result.value
				)
			return result
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
			return result
	}
}
function validDate(date: string, format?: DateFormat | isoly.Locale): boolean {
	switch (format) {
		case "dd/MM/YYYY":
			const year = parseInt(date.substring(6, 10))
			const month = parseInt(date.substring(3, 5))
			const day = parseInt(date.substring(0, 2))
			return daysPerMonth(year, month) >= day
		default:
			const year1 = parseInt(date.substring(0, 4))
			const month1 = parseInt(date.substring(5, 7))
			const day1 = parseInt(date.substring(8, 10))
			return daysPerMonth(year1, month1) >= day1
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
