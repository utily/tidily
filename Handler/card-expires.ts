import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<[number, number]>, Formatter {
	toString(data?: [number, number] | string | unknown): string {
		return Array.isArray(data) && data.length == 2 && typeof data[0] == "number" && typeof data[1] == "number"
			? data[0].toString().padStart(2, "0") + data[1].toString().padStart(2, "0")
			: ""
	}
	fromString(value: string): [number, number] | undefined {
		return typeof value == "string" && value.length == 4
			? [Number.parseInt(value.slice(0, 2)), Number.parseInt(value.slice(2))]
			: undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (unformatted.value.length > 0 && !unformatted.is(0, "0", "1"))
			result = result.prepend("0")
		if (result.value.length > 1)
			result = result.insert(2, " / ")
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			autocomplete: "cc-exp",
			length: [7, 7],
			pattern: /^(0[1-9]|1[012]) \/ \d\d$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(" / ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 4 && symbol >= "0" && symbol <= "9"
	}
}
add("card-expires", () => new Handler())
