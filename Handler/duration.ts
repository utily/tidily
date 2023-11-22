import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

function toDuration(hours: number): { hours: number; minutes: number } {
	const h = Math.floor(hours)
	return { hours: h, minutes: Math.floor((hours - h) * 60) }
}

class Handler implements Converter<{ hours: number; minutes: number }>, Formatter {
	toString(data: number | string | any): string {
		const duration = typeof data == "number" && toDuration(data)
		return duration ? duration.hours.toString() + ":" + duration.minutes.toString().padStart(2, "0") : ""
	}
	fromString(value: string): { hours: number; minutes: number } | undefined {
		const splitted = typeof value == "string" && value.split(":", 2).map(value => Number.parseInt(value))
		return splitted ? { hours: splitted[0], minutes: splitted[1] } : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (result.value.length > 0)
			result = result.suffix(" h")
		return { ...result, type: "tel", pattern: /^\d*:{0,1}[0-5]{0,1}[0-9]{0,1}(\sh{0,1}){0,1}$/ }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(" h")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const nextValue = state.value.slice(0, state.selection.start) + symbol + state.value.slice(state.selection.end)
		const matchResult = nextValue.match(/^\d*:{0,1}[0-5]{0,1}[0-9]{0,1}(\sh{0,1}){0,1}$/)
		return matchResult !== null
	}
}
add("duration", () => new Handler())
