import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	constructor(readonly currency: isoly.Currency | undefined) {}
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): number | undefined {
		return typeof value == "string" ? Number(value) : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let separator = unformated.value.includes(".") ? unformated.value.indexOf(".")
			: unformated.value.length
		let result = StateEditor.copy(unformated)
		const maxDecimals = !this.currency || isoly.Currency.decimalDigits(this.currency) == undefined ? 2 : isoly.Currency.decimalDigits(this.currency) as number
		result = result.truncate(separator + maxDecimals + 1)
		const spaces = separator <= 0 ? 0 : Math.ceil(separator / 3) - 1
		for (let i = 0; i < spaces; i++) {
			const position = separator - (spaces - i) * 3
			result = result.insert(position, " ")
			separator++
		}
		result = this.currency && (result.value.length > 1 || result.value.length == 1 && result.value.charAt(0) != ".") ? result.suffix(" " + this.currency) : result
		return { ...result, type: "text", length: [3, undefined], pattern: new RegExp("^(\\d{0,3})( \\d{3})*(\\.\\d+)?" + (this.currency ? " " + this.currency : "") + "$") }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return this.currency ? formated.delete(" ").delete("" + this.currency) : formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9" || symbol == "." && !state.value.includes(".")
	}
}
add("price", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
