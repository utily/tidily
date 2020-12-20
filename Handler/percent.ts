import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data: number | any): string {
		return data && typeof data == "number" ? (data * 100).toString() : ""
	}
	fromString(value: string): number | undefined {
		return typeof value != "string" || !Number.parseFloat(value) ? undefined : Number.parseFloat(value) / 100
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return {
			...(unformated.value ? unformated.suffix(" %") : unformated),
			type: "text",
			length: [3, undefined],
			pattern: /^\d+(.\d)? %+$/,
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" %")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (symbol >= "0" && symbol <= "9") || (symbol == "." && !state.value.includes("."))
	}
}
add("percent", () => new Handler())
