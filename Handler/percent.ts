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
	format(unformatted: StateEditor): Readonly<State> & Settings {
		return {
			...(unformatted.value ? unformatted.suffix(" %") : unformatted),
			type: "text",
			length: [3, undefined],
			pattern: /^\d+(.\d)? %+$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(" %")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (symbol >= "0" && symbol <= "9") || (symbol == "." && !state.value.includes("."))
	}
}
add("percent", () => new Handler())
