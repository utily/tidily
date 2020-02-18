import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<number>, Formatter {
	toString(data: number): string {
		return (data * 100).toString()
	}
	fromString(value: string): number | undefined {
		return Number.parseFloat(value) / 100
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated.replace(",", "."), type: "text", length: [3, undefined], pattern: /^\d+(.\d)? %+$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9" || symbol == "."
	}
}
add("percent", () => new Handler())
