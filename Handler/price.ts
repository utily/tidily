import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	constructor(readonly currency: isoly.Currency | undefined) {}
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" ? value : undefined
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
		result = result.suffix(" " +  this.currency)
		return { ...result, type: "text", length: [3, undefined], pattern: new RegExp("^\\d*(\\.\\d+)? " + this.currency + "$/") }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" ").delete("" + this.currency)
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9" || symbol == "." && !state.value.includes(".")
	}
}
add("price", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
