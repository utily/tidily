import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" ? value : undefined
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
