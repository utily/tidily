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
	partialFormat(unformatted: StateEditor): Readonly<State> & Settings {
		let result =
			unformatted.value == "NaN" ? unformatted.replace(0, unformatted.value.length, "") : StateEditor.copy(unformatted)

		result = this.addThousandSeparators(result)

		if (result.match(/^[0\s]{2,}$/))
			result = result.replace(0, result.value.length, "0")
		else if (result.match(/^[0\s]{2,}(\s\w{3}){1}$/))
			result = result.replace(0, result.value.length - 4, "0")

		result = this.appendCurrency(result)
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

		if (!result.value.includes(".") && decimals && Math.abs(Number.parseFloat(result.value)) > 0)
			result = result.suffix(".0")

		// Add 0 if e.i. ".10"
		let separatorIndex = result.value && result.value.includes(".") ? result.value.indexOf(".") : undefined
		if (separatorIndex == 0) {
			result = result.prepend("0")
			separatorIndex++
		}
		// add fill decimals with zeros
		if (separatorIndex != undefined) {
			const adjust = separatorIndex + 1 + (decimals ?? 2) - result.value.length
			result = adjust < 0 ? result.truncate(result.value.length + adjust) : result.suffix("0".repeat(adjust))
		}

		result = this.addThousandSeparators(result)

		if (result.match(/^[0\s]{2,}$/))
			result = result.replace(0, result.value.length, "0")
		else if (result.match(/^[0\s]{2,}(\s\w{3}){1}$/))
			result = result.replace(0, result.value.length - 4, "0")

		result = this.appendCurrency(result)
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d+)?" + (this.currency ? " " + this.currency : "") + "$"),
		}
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
