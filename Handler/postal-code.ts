import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	constructor(readonly country: isoly.CountryCode.Alpha2 | undefined) {}
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" ? value : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		const result =
			!unformated.value.includes(" ") && unformated.value.length >= 4 ? unformated.insert(3, " ") : unformated
		return {
			...result.truncate(6),
			type: "text",
			autocomplete: "postal-code",
			length: [6, 6],
			pattern: /^\d{3} \d{2}$/,
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length <= 5 && symbol >= "0" && symbol <= "9"
	}
}
add("postal-code", (argument?: isoly.CountryCode.Alpha2) => new Handler(argument))
