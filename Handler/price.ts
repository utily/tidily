import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	constructor(readonly currency: isoly.Currency | undefined) {}
	toString(data: string): string {
		return data
	}
	fromString(value: string): string | undefined {
		return value
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		const result = unformated.append(" " +  this.currency)
		return { ...result, type: "text", length: [3, undefined], pattern: new RegExp("^\\d*(\\.\\d+)? " + this.currency + "$/") }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.replace(",", ".").delete(" " + this.currency)
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 4 && symbol >= "0" && symbol <= "9"
	}
}
add("price", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
