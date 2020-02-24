import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data: number | any): string {
		return typeof data == "number" ? data.toString() : ""
	}
	fromString(value: string): number | undefined {
		return typeof value == "string" ? Number.parseInt(value) : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated, type: "text", autocomplete: "cc-csc", length: [3, 3], pattern: /^\d{3}$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 3 && symbol >= "0" && symbol <= "9"
	}
}
add("card-csc", () => new Handler())
