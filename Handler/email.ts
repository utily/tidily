import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	constructor(private readonly settings: Omit<Settings, "type">) {}
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" ? value : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated, ...this.settings, type: "email", autocomplete: "email" }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			this.settings.length == undefined ||
			this.settings.length[1] == undefined ||
			state.value.length < this.settings.length[1]
		)
	}
}
add("email", (settings?: any) => new Handler(settings || {}))
