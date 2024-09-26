import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<number | [number, number]>, Formatter {
	toString(data?: number | [number, number] | string | unknown): string {
		return Array.isArray(data) && data.length == 2 && typeof data[0] == "number" && typeof data[1] == "number"
			? data[0].toString() + " / " + data[1].toString()
			: typeof data == "number"
			? data.toString()
			: ""
	}
	fromString(value: string): number | [number, number] | undefined {
		return typeof value == "string" && value.match(/^\d{1,2}\s+\/\s+\d{1,2}$/)
			? [Number.parseInt(value.slice(0, 2)), Number.parseInt(value.slice(value.length - 2))]
			: typeof value == "string" && value.match(/\d{1,2}/)
			? Number.parseInt(value)
			: undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (unformatted.match(/^\d\/$/))
			result = unformatted.replace(1, 2, " / ")
		else if (unformatted.match(/^\d{1,2}\s$/))
			result = unformatted.replace(unformatted.value.length - 1, unformatted.value.length, " / ")
		else if (unformatted.match(/^[\D.]+\/[\D.]+$/))
			result = unformatted.delete(0, unformatted.value.length)
		else if (unformatted.match(/^[\D.]+\/[\D.]+\d$/))
			result = unformatted.delete(0, unformatted.value.length - 1)
		else if (unformatted.match(/^[\D.]+\/[\D.]+\d\d$/))
			result = unformatted.delete(0, unformatted.value.length - 2)
		else if (unformatted.match(/^[\D.]+\//))
			result = unformatted.delete(0, unformatted.value.search("/") + 1)
		else if (unformatted.match(/^\d\d\/$/))
			result = unformatted.replace(2, 3, " / ")
		else if (unformatted.match(/^\d\d\s+\/$/))
			result = unformatted.delete(2, unformatted.value.length)
		else if (unformatted.match(/^\d\s+\/$/))
			result = unformatted.delete(1, unformatted.value.length)
		else if (unformatted.match(/^\d\d\s\s+\/\s*$/))
			result = unformatted.replace(2, unformatted.value.length, " / ")
		else if (unformatted.match(/^\d\s\s+(\/\s*)?$/))
			result = unformatted.replace(1, unformatted.value.length, " / ")
		else if (unformatted.match(/^\d\s\/\s\d\d.+$/))
			result = unformatted.delete(6, unformatted.value.length)
		else if (unformatted.value.length > 1 && unformatted.value.indexOf("/") < 1)
			result = unformatted.insert(2, " / ")
		else if (unformatted.value.length > 1 && unformatted.value.split("/").length > 2)
			result = unformatted.delete(unformatted.value.lastIndexOf("/"))
		else if (unformatted.value.length == 1 && !unformatted.isDigit(0))
			result = unformatted.delete(0)
		return { ...result, type: "text", length: [1, 7], pattern: /^(\d{1,2}|\d{1,2} \/ \d{1,2})$/ }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 7 && ((symbol >= "0" && symbol <= "9") || symbol == "/" || symbol == " ")
	}
}
add("divisor", () => new Handler())
