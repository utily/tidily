import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

function toDuration(hours: number): [number, number] {
	const h = Math.floor(hours)
	return [h, Math.floor((hours - h) * 60)]
}
function fromDuration(hours: number, minutes: number): number {
	return hours + (minutes * 100) / 60
}

class Handler implements Converter<number>, Formatter {
	toString(data: number | string | any): string {
		const duration = typeof data == "number" && toDuration(data)
		return duration ? data[0].toString() + ":" + data[1].toString().padStart(2, "0") : ""
	}
	fromString(value: string): number | undefined {
		const splitted = typeof value == "string" && value.split(":", 2).map(Number.parseInt)
		return splitted ? fromDuration(splitted[0], splitted[1]) : undefined
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
