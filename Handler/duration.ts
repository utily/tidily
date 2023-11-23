import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<{ hours?: number; minutes?: number } | undefined>, Formatter {
	private pattern: RegExp
	constructor(readonly unit = "h") {
		this.unit = ` ${unit.trim()}`
		const suffix = this.unit
			.split("")
			.map(symbol => symbol + "{0,1}")
			.join("")
		this.pattern = new RegExp(`^\\d*:{0,1}[0-5]{0,1}[0-9]{0,1}${suffix}$`)
	}
	toString(data: { hours?: number; minutes?: number } | undefined): string {
		return `${data?.hours?.toString(10) ?? "0"}:${data?.minutes?.toString(10).padStart(2, "0") ?? "00"}`
	}
	fromString(value: string): { hours?: number; minutes?: number } | undefined {
		const splitted = typeof value == "string" && value.split(":", 2).map(value => Number.parseInt(value))
		return splitted
			? {
					...(Number.isFinite(splitted[0]) && { hours: splitted[0] }),
					...(Number.isFinite(splitted[1]) && { minutes: splitted[1] }),
			  }
			: undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (result.value.match(/^:/))
			result = result.prepend("0")
		if (result.value.length > 0)
			result = result.suffix(this.unit)
		return { ...result, type: "tel", pattern: /^\d*:{0,1}[0-5]{0,1}[0-9]{0,1}(\sh{0,1}){0,1}$/ }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(this.unit)
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const nextValue =
			state.value.slice(0, state.selection.start) + symbol + state.value.slice(state.selection.end) + this.unit
		return !!nextValue.match(this.pattern)
	}
}
add("duration", () => new Handler())
