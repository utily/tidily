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
// function fromDuration(hours: number, minutes: number): number {
// 	return hours + (minutes * 100) / 60
// }

class Handler implements Converter<{ hours: number; minutes: number }>, Formatter {
	toString(data: number | string | any): string {
		const duration = typeof data == "number" && toDuration(data)
		return duration ? duration.hours.toString() + ":" + duration.minutes.toString().padStart(2, "0") : ""
	}
	fromString(value: string): { hours: number; minutes: number } | undefined {
		const splitted = typeof value == "string" && value.split(":", 2).map(Number.parseInt)
		return splitted ? { hours: splitted[0], minutes: splitted[1] } : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const result = unformatted
		return { ...result, type: "tel", pattern: /^\d*:\d\d$/ }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (symbol >= "0" && symbol <= "9") || symbol == ":"
	}
}
add("duration", () => new Handler())
