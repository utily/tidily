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
		let result = unformated
		if (!unformated.is(0, " ", "0", "1"))
			result = result.prepend(" ")
		if (result.value.length > 1)
			result = result.insert(2, " / ")
		return { ...result, type: "text", autocomplete: "cc-exp", length: [5, 5], pattern: /^[\d ]\d \/ \d\d$/ }
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" / ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length < 4 && symbol >= "0" && symbol <= "9"
	}
}
add("card-expires", () => new Handler())
