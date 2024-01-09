import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<{ hours: number; minutes: number } | undefined>, Formatter {
	// 									  normal time		  						 | 	decimal time
	private pattern = /(^\d*:{0,1}[0-5]{0,1}[0-9]{0,1}$|^\d*[.,]{0,1}[0-9]{0,2}$)/
	private decimal: boolean
	toString(data: { hours: number; minutes: number } | undefined): string {
		return `${data?.hours?.toString(10) ?? "0"}:${data?.minutes?.toString(10).padStart(2, "0") ?? "00"}`
	}
	fromString(value: string): { hours: number; minutes: number } | undefined {
		let result: undefined | { hours: number; minutes: number }
		if (!this.decimal) {
			const splitted = value.split(":", 2).map(value => Number.parseInt(value))
			result = splitted
				? {
						hours: !splitted[0] || !Number.isFinite(splitted[0]) ? 0 : splitted[0],
						minutes: !splitted[1] || !Number.isFinite(splitted[1]) ? 0 : splitted[1],
				  }
				: undefined
		} else if (this.decimal) {
			const splittedString = "string" && value.split(".", 2)
			if (splittedString) {
				splittedString[1] = splittedString[1].length == 1 ? splittedString[1] + "0" : splittedString[1]
			}
			const splitted = splittedString ? splittedString.map(value => Number.parseInt(value)) : undefined
			result = splitted
				? {
						hours: !splitted[0] || !Number.isFinite(splitted[0]) ? 0 : splitted[0],
						minutes: !splitted[1] || !(0 <= splitted[1] && splitted[1] < 100) ? 0 : (splitted[1] / 100) * 60,
				  }
				: undefined
		}
		return result
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (result.value.match(/^[.,:]/))
			result = result.prepend("0")
		return { ...result, type: "tel", pattern: /^\d*:{0,1}[0-5]{0,1}[0-9]{0,1}(\sh{0,1}){0,1}$/ }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		if (formatted.value.includes(".") || formatted.value.includes(",")) {
			this.decimal = true
		} else
			this.decimal = false
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const nextValue = state.value.slice(0, state.selection.start) + symbol + state.value.slice(state.selection.end)
		return !!nextValue.match(this.pattern)
	}
}
add("duration", () => new Handler())
