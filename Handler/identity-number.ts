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
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		const year = new Date().getFullYear().toString()
		if (unformatted.value.length > 1 && unformatted.get(0, 2) != "19" && unformatted.get(0, 2) != "20")
			result = result.prepend(unformatted.get(0, 2) > year.substr(2, 2) ? "19" : "20")
		if (result.value.length >= 8)
			result = result.insert(8, "-")
		return {
			...result.truncate(13),
			type: "text",
			length: [11, 13],
			pattern: /^\d{6,8}-\d{4}$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete("-")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 13 && symbol >= "0" && symbol <= "9"
	}
}
add("identity-number", (argument?: any[]) => new Handler(argument && argument.length > 0 ? argument[0] : undefined))
