import * as isoly from "isoly"
import { DateFormat } from "../../DateFormat"
import { State } from "../../State"

export function validDay(symbol: string, state: Readonly<State>, firstDigit: number, secondDigit: number): boolean {
	if (state.value.length == firstDigit)
		return symbol <= "3"
	else if (state.value.length == secondDigit) {
		if (state.value !== "3")
			return symbol <= "9" || symbol >= "0"
		else
			return symbol <= "1"
	}
	return false
}

export function validMonth(symbol: string, state: Readonly<State>, firstDigit: number, secondDigit: number): boolean {
	if (state.value.length == firstDigit)
		return symbol <= "1"
	else if (state.value.length == secondDigit) {
		if (state.value == "0")
			return symbol < "10" || symbol >= "1"
		else
			return symbol < "3"
	}
	return false
}

export function validYear(symbol: string, state: Readonly<State>, firstDigit: number, secondDigit: number): boolean {
	return state.value.length < firstDigit && state.value.length >= secondDigit && symbol >= "0" && symbol <= "9"
}

export function validSymbol(
	symbol: string,
	state: Readonly<State>,
	firstDigit: number,
	secondDigit: number,
	character: string
): boolean {
	return (state.value.length == firstDigit || state.value.length == secondDigit) && symbol == character
}

export function validFormat(symbol: string, state: Readonly<State>, format?: DateFormat | isoly.Locale): boolean {
	switch (format) {
		case "dd/MM/YYYY":
			return (
				validDay(symbol, state, 0, 1) ||
				validSymbol(symbol, state, 2, 5, "/") ||
				validMonth(symbol, state, 3, 4) ||
				validYear(symbol, state, 10, 6)
			)
		default:
			return (
				validDay(symbol, state, 8, 9) ||
				validSymbol(symbol, state, 4, 7, "-") ||
				validMonth(symbol, state, 5, 6) ||
				validYear(symbol, state, 4, 0)
			)
	}
}
