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
		return { ...unformatted, type: "password", autocomplete: "current-password" }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return true
	}
}
add("password", () => new Handler())
