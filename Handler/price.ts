import { isoly } from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

export interface PriceOptions {
	currency?: isoly.Currency
	toInteger?: boolean
}

class Handler implements Converter<number>, Formatter {
	readonly currency: isoly.Currency | undefined
	readonly toInteger: boolean | undefined
	constructor(options: PriceOptions | isoly.Currency | undefined) {
		this.currency = options && typeof options == "object" ? options.currency : options
		this.toInteger = options && typeof options == "object" ? options.toInteger : undefined
	}
	toString(data?: number | unknown): string {
		return typeof data == "number" ? (isNaN(data) ? "" : data.toString()) : ""
	}
	fromString(value: string): number | undefined {
		const result = typeof value == "string" ? Number.parseFloat(value) : undefined
		return result != undefined && !isNaN(result) ? result : undefined
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
			remainder: this.format(unformatted).value.slice(result.value.length),
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d*)?$"),
		}
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result =
			unformatted.value == "NaN" ? unformatted.replace(0, unformatted.value.length, "") : StateEditor.copy(unformatted)
		const decimals = this.currency && isoly.Currency.decimalDigits(this.currency)
		if (!this.toInteger)
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
		if (!state.value.includes(".") && decimals && (Math.abs(Number.parseFloat(state.value)) >= 0 || state.value == "0"))
			state = state.suffix(".0")
		return state
	}
	addLeadingIntegerZero(state: StateEditor) {
		const separatorIndex = state.value && state.value.includes(".") ? state.value.indexOf(".") : undefined
		if (separatorIndex == 0)
			state = state.prepend("0")
		return state
	}
	fillDecimalsIfPresent(state: StateEditor, decimals: number | undefined, zeroHandling: "fillAndLimit" | "onlyLimit") {
		const separatorIndex = state.value.indexOf(".")
		if (separatorIndex != -1) {
			const adjust = separatorIndex + 1 + (decimals ?? 2) - state.value.length
			state =
				adjust < 0
					? state.truncate(state.value.length + adjust)
					: zeroHandling == "fillAndLimit"
					? state.suffix("0".repeat(adjust))
					: state
		}
		return state
	}
	truncateIntegerZeros(state: StateEditor) {
		const match = state.match(/^[0\s]{2,}/)
		if (match)
			state = state.replace(0, match[0].length, "0")
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
