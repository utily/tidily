import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data: number | any): string {
		return typeof data == "number" ? (data * 100).toString() : ""
	}
	fromString(value: string): number | undefined {
		return typeof value == "string" ? Number.parseFloat(value) / 100 : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated.suffix(unformated.value != "" ? " %" : ""), type: "text", length: [3, undefined], pattern: /^\d+(.\d)? %+$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" %")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9" || symbol == "." && !state.value.includes(".")
	}
}
add("percent", () => new Handler())
