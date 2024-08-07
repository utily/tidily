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
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result =
			unformatted.value == "NaN" ? unformatted.replace(0, unformatted.value.length, "") : StateEditor.copy(unformatted)
		const decimals = this.currency && isoly.Currency.decimalDigits(this.currency)
		if (!result.value.includes(".") && decimals && Math.abs(Number.parseFloat(result.value)) > 0)
			result = result.suffix(".0")
		let separator = result.value && result.value.includes(".") ? result.value.indexOf(".") : undefined
		if (separator == 0) {
			result = result.prepend("0")
			separator++
		}
		if (separator != undefined) {
			const adjust = separator + 1 + (decimals ?? 2) - result.value.length
			result = adjust < 0 ? result.truncate(result.value.length + adjust) : result.suffix("0".repeat(adjust))
		} else
			separator = result.value.length
		const spaces = separator <= 0 ? 0 : Math.ceil(separator / 3) - 1
		for (let i = 0; i < spaces; i++) {
			const position = separator - (spaces - i) * 3
			result = result.insert(position, " ")
			separator++
		}
		if (result.match(/^[0\s]{2,}$/))
			result = result.replace(0, result.value.length, "0")
		else if (result.match(/^[0\s]{2,}(\s\w{3}){1}$/))
			result = result.replace(0, result.value.length - 4, "0")
		result =
			this.currency && (result.value.length > 1 || (result.value.length == 1 && result.value.charAt(0) != "."))
				? result.suffix(" " + this.currency)
				: result
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d+)?" + (this.currency ? " " + this.currency : "") + "$"),
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return this.currency ? formatted.delete(" ").delete("" + this.currency) : formatted.delete(" ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (symbol >= "0" && symbol <= "9") || (symbol == "." && !state.value.includes("."))
	}
}
add("price", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
