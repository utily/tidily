import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data?: number | unknown): string {
		return typeof data == "number" ? data.toString() : ""
	}
	fromString(value: string): number | undefined {
		const parsed = typeof value == "string" ? Number.parseInt(value) : undefined
		return typeof parsed == "number" && !Number.isNaN(parsed) ? parsed : undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		return {
			...unformatted,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: /^[0-9]+$/,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9"
	}
}
add("integer", () => new Handler())
