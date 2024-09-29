import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	constructor(readonly country: isoly.CountryCode.Alpha2 | undefined) {}
	toString(data?: string | unknown): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" && !!value ? value : undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const result =
			!unformatted.value.includes(" ") && unformatted.value.length >= 4 ? unformatted.insert(3, " ") : unformatted
		return {
			...result.truncate(6),
			type: "text",
			autocomplete: "postal-code",
			length: [6, 6],
			pattern: /^\d{3} \d{2}$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(" ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length <= 5 && symbol >= "0" && symbol <= "9"
	}
}
add("postal-code", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
