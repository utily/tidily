import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data?: string | unknown): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" && !!value ? value : undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		return {
			...unformatted,
			type: "text",
			inputmode: "numeric",
			autocomplete: "cc-csc",
			length: [3, 3],
			pattern: /^\d{3}$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 3 && symbol >= "0" && symbol <= "9"
	}
}
add("card-csc", () => new Handler())
