import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<[number, number]>, Formatter {
	toString(data: [number, number]): string {
		return data[0].toString().padStart(2, " ") + data[1].toString().padStart(2, " ")
	}
	fromString(value: string): [number, number] | undefined {
		return [Number.parseInt(value.slice(0, 2)), Number.parseInt(value.slice(2))]
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		return { ...unformated, type: "text", autocomplete: "cc-csc", length: [3, 3], pattern: /^\d{3}$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 3 && symbol >= "0" && symbol <= "9"
	}
}
add("card-csc", () => new Handler())
