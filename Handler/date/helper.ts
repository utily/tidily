import * as isoly from "isoly"
import { DateFormat } from "../../DateFormat"
import { State } from "../../State"

export function validDay(symbol: string, state: Readonly<State>, startIndex: number, endIndex: number): boolean {
	let result = false
	if (state.value.length == startIndex)
		result = symbol <= "3" && symbol >= "0"
	else if (state.value.length == endIndex) {
		if (
			state.value.substring(startIndex, startIndex + 1) == "2" ||
			state.value.substring(startIndex, startIndex + 1) == "1"
		)
			result = symbol <= "9" && symbol >= "0"
		else if (state.value.substring(startIndex, startIndex + 1) == "0")
			result = symbol <= "9" && symbol >= "1"
		else
			result = symbol == "1" || symbol == "0"
	}
	return result
}

export function validMonth(symbol: string, state: Readonly<State>, startIndex: number, endIndex: number): boolean {
	let result = false
	if (state.value.length == startIndex)
		result = symbol == "1" || symbol == "0"
	else if (state.value.length == endIndex) {
		if (state.value.substring(startIndex, startIndex + 1) != "1")
			result = symbol <= "9" && symbol >= "1"
		else
			result = symbol < "3" && symbol >= "0"
	}
	return result
}

export function validYear(symbol: string, state: Readonly<State>, startIndex: number, endIndex: number): boolean {
	return state.value.length < endIndex && state.value.length >= startIndex && symbol >= "0" && symbol <= "9"
}

export function validSymbol(
	symbol: string,
	state: Readonly<State>,
	firstSplitter: number,
	lastSplitter: number,
	character: string
): boolean {
	return (state.value.length == firstSplitter || state.value.length == lastSplitter) && symbol == character
}

export function validFormat(symbol: string, state: Readonly<State>, format?: DateFormat | isoly.Locale): boolean {
	let result: boolean
	switch (format) {
		case "dd/mm/YYYY":
			result =
				validDay(symbol, state, 0, 1) ||
				validSymbol(symbol, state, 2, 5, "/") ||
				validMonth(symbol, state, 3, 4) ||
				validYear(symbol, state, 6, 10)
			break
		case "dd.mm.YYYY":
			result =
				validDay(symbol, state, 0, 1) ||
				validSymbol(symbol, state, 2, 5, ".") ||
				validMonth(symbol, state, 3, 4) ||
				validYear(symbol, state, 6, 10)
			break
		case "mm/dd/YYYY":
			result =
				validDay(symbol, state, 3, 4) ||
				validSymbol(symbol, state, 2, 5, "/") ||
				validMonth(symbol, state, 0, 1) ||
				validYear(symbol, state, 6, 10)
			break
		default:
			result =
				validDay(symbol, state, 8, 9) ||
				validSymbol(symbol, state, 4, 7, "-") ||
				validMonth(symbol, state, 5, 6) ||
				validYear(symbol, state, 0, 4)
			break
	}
	return result
}
