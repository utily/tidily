import * as isoly from "isoly"
import { DateFormat } from "../../DateFormat"
import { State } from "../../State"

export function validDay(symbol: string, state: Readonly<State>, startIndex: number, endIndex: number): boolean {
	if (state.value.length == startIndex)
		return symbol <= "3"
	else if (state.value.length == endIndex) {
		if (state.value !== "3")
			return symbol <= "9" || symbol >= "0"
		else
			return symbol <= "1"
	}
	return false
}

export function validMonth(symbol: string, state: Readonly<State>, startIndex: number, endIndex: number): boolean {
	if (state.value.length == startIndex)
		return symbol <= "1"
	else if (state.value.length == endIndex) {
		if (state.value !== "1")
			return symbol <= "9" || symbol >= "1"
		else
			return symbol < "3"
	}
	return false
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
	switch (format) {
		case "DD/MM/YYYY":
			return (
				validDay(symbol, state, 0, 1) ||
				validSymbol(symbol, state, 2, 5, "/") ||
				validMonth(symbol, state, 3, 4) ||
				validYear(symbol, state, 6, 10)
			)
		default:
			return (
				validDay(symbol, state, 8, 9) ||
				validSymbol(symbol, state, 4, 7, "-") ||
				validMonth(symbol, state, 5, 6) ||
				validYear(symbol, state, 0, 4)
			)
	}
}
