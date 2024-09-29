import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(value?: number | unknown): string {
		return typeof value == "string" ? "#" + value : ""
	}
	fromString(value: string): string | undefined {
		return value ? "#" + value : undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const result = unformatted.delete("#")
		return {
			...(result.value ? result.prepend("#") : result),
			type: "text",
			length: [4, 7],
			pattern: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete("#")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			((symbol >= "0" && symbol <= "9") || (symbol >= "a" && symbol <= "f") || (symbol >= "A" && symbol <= "F")) &&
			state.value.length < 6
		)
	}
}
add("hex-color", () => new Handler())
