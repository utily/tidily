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
		let result = unformated
		const year = new Date().getFullYear().toString()
		if (unformated.value.length > 1 && unformated.get(0, 2) != "19" && unformated.get(0, 2) != "20")
			result = result.prepend(unformated.get(0, 2) > year.substr(2, 2) ? "19" : "20")
		if (result.value.length >= 8)
			result = result.insert(8, "-")
		return {
			...result.truncate(13),
			type: "text",
			length: [11, 13],
			pattern: /^\d{6,8}-\d{4}$/,
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete("-")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 13 && symbol >= "0" && symbol <= "9"
	}
}
add("identity-number", (country?: isoly.CountryCode.Alpha2) => new Handler(country))
