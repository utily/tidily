import { isoly } from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	constructor(readonly currency: isoly.Currency | undefined) {}
	toString(data?: number | unknown): string {
		return typeof data == "number" ? (isNaN(data) ? "" : data.toString()) : ""
	}
	fromString(value: string): number | undefined {
		const result = typeof value == "string" ? Number.parseFloat(value) : undefined
		return result != undefined && !isNaN(result) ? result : undefined
	}
	// TODO - add autofill function that would give a preview of how it would autocomplete
	// E.g.
	// Input written "123.0" autofill with "0 EUR"
	// or for Date
	// Input written "202" autofill "Y-MM-DD"
	// Name suggestions:
	// autofill, complete, fillMissing, suggestMissing - these imply that it will fill the rest with is wrong for date
	// formatRest, supplement, leftover, remaining, remainder, missing - something like this
	formattedRemainder(unformatted: StateEditor) {
		let result = StateEditor.copy(unformatted)

		result = this.appendCurrency(result)
		return result
	}

	partialFormat(unformatted: StateEditor): Readonly<State> & Settings {
		let result =
			unformatted.value == "NaN" ? unformatted.replace(0, unformatted.value.length, "") : StateEditor.copy(unformatted)
		const decimals = this.currency && isoly.Currency.decimalDigits(this.currency)
		result = this.fillDecimalsIfPresent(result, decimals, "onlyLimit")
		result = this.truncateIntegerZeros(result)
		result = this.addThousandSeparators(result)
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d+)?" + (this.currency ? " " + this.currency : "") + "$"),
		}
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result =
			unformatted.value == "NaN" ? unformatted.replace(0, unformatted.value.length, "") : StateEditor.copy(unformatted)
		const decimals = this.currency && isoly.Currency.decimalDigits(this.currency)
		result = this.forceDecimalZero(result, decimals)
		result = this.addLeadingIntegerZero(result)
		result = this.fillDecimalsIfPresent(result, decimals, "fillAndLimit")
		result = this.truncateIntegerZeros(result)
		result = this.addThousandSeparators(result)
		result = this.appendCurrency(result)
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d+)?" + (this.currency ? " " + this.currency : "") + "$"),
		}
	}

	forceDecimalZero(state: StateEditor, decimals?: number) {
		if (!state.value.includes(".") && decimals && Math.abs(Number.parseFloat(state.value)) > 0)
			state = state.suffix(".0")
		return state
	}

	addLeadingIntegerZero(state: StateEditor) {
		let separatorIndex = state.value && state.value.includes(".") ? state.value.indexOf(".") : undefined
		if (separatorIndex == 0) {
			state = state.prepend("0")
			separatorIndex++
		}
		return state
	}

	fillDecimalsIfPresent(state: StateEditor, decimals: number | undefined, zeroHandling: "fillAndLimit" | "onlyLimit") {
		const separatorIndex = state.value.indexOf(".")
		if (separatorIndex != -1) {
			const adjust = separatorIndex + 1 + (decimals ?? 2) - state.value.length
			console.log({ separatorIndex, decimals, valueLength: state.value.length })
			console.log("adjust", adjust, state.value)
			state =
				adjust < 0
					? state.truncate(state.value.length + adjust)
					: zeroHandling == "fillAndLimit"
					? state.suffix("0".repeat(adjust))
					: state
			console.log("adjusted", adjust, state.value)
		}
		return state
	}

	truncateIntegerZeros(state: StateEditor) {
		if (state.match(/^[0\s]{2,}$/))
			state = state.replace(0, state.value.length, "0")
		else if (state.match(/^[0\s]{2,}(\s\w{3}){1}$/))
			state = state.replace(0, state.value.length - 4, "0")
		return state
	}

	addThousandSeparators(state: StateEditor) {
		let separatorIndex = state.value.includes(".") ? state.value.indexOf(".") : state.value.length
		const spaces = separatorIndex <= 0 ? 0 : Math.ceil(separatorIndex / 3) - 1
		for (let i = 0; i < spaces; i++) {
			const position = separatorIndex - (spaces - i) * 3
			state = state.insert(position, " ")
			separatorIndex++
		}
		return state
	}

	appendCurrency(state: StateEditor) {
		return this.currency && (state.value.length > 1 || (state.value.length == 1 && state.value.charAt(0) != "."))
			? state.suffix(" " + this.currency)
			: state
	}

	unformat(formatted: StateEditor): Readonly<State> {
		return this.currency ? formatted.delete(" ").delete("" + this.currency) : formatted.delete(" ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (symbol >= "0" && symbol <= "9") || (symbol == "." && !state.value.includes("."))
	}
}
add("price", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
