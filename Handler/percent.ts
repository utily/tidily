import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data?: number | unknown): string {
		return typeof data == "number" ? (data * 100).toString() : ""
	}
	fromString(value: string): number | undefined {
		const parsedFloat = typeof value == "string" ? Number.parseFloat(value) : undefined
		return typeof parsedFloat == "number" && !Number.isNaN(parsedFloat) ? parsedFloat / 100 : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		return {
			...(unformatted.value ? unformatted.suffix(" %") : unformatted),
			type: "text",
			inputmode: "numeric",
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
