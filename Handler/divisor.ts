import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<number | [number, number]>, Formatter {
	toString(data: number | [number, number] | string | any): string {
		return Array.isArray(data) && data.length == 2 && typeof data[0] == "number" && typeof data[1] == "number"
			? data[0].toString() + data[1].toString()
			: typeof data == "number"
			? data.toString()
			: ""
	}
	fromString(value: string): number | [number, number] | undefined {
		return typeof value == "string" && value.length == 4
			? [Number.parseInt(value.slice(0, 2)), Number.parseInt(value.slice(2))]
			: typeof value == "string" && (value.length == 3 || value.length == 2)
			? [Number.parseInt(value.slice(0, 1)), Number.parseInt(value.slice(1))]
			: typeof value == "string" && value.length == 1
			? Number.parseInt(value)
			: undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		let result = unformated
		if (unformated.match(/^\d\/$/))
			result = unformated.replace(1, 2, " / ")
		else if (unformated.match(/^\d\d\/$/))
			result = unformated.replace(2, 3, " / ")
		else if (unformated.match(/^\d\d \/$/))
			result = unformated.replace(unformated.value.length - 2, unformated.value.length, "")
		else if (unformated.value.length > 1 && unformated.value.indexOf("/") < 1)
			result = unformated.insert(2, " / ")
		else if (unformated.value.length > 1 && unformated.value.split("/").length > 2)
			result = unformated.delete(unformated.value.lastIndexOf("/"))
		else if (unformated.value.length == 1 && !unformated.isDigit(0))
			result = unformated.delete(0)
		return { ...result, type: "text", length: [1, 7], pattern: /^(\d{1,2}|\d{1,2} \/ \d{1,2})$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 7 && ((symbol >= "0" && symbol <= "9") || symbol == "/" || symbol == " ")
	}
}
add("divisor", () => new Handler())
