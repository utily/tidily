import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data: string): string {
		return data
	}
	fromString(value: string): string | undefined {
		return value
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated, type: "password", autocomplete: "current-password" }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return true
	}
}
add("password", () => new Handler())
