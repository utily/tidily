import { isoly } from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

type Duration = Pick<isoly.TimeSpan, "hours" | "minutes"> | undefined

class Handler implements Converter<Duration>, Formatter {
	private patterns = {
		//           hours |    "normal" minutes     | decimal minutes
		allowed: /^-?\d*(?::{0,1}[0-5]{0,1}[0-9]{0,1}|[.,]{0,1}[0-9]{0,2})$/,
		//      sign | hours |   sep   | minutes
		extract: /^(-?)(\d*)([:,.]{0,1})([0-9]{0,2})$/,
	}
	private separator = ":"
	toString(data?: { hours: number; minutes: number } | unknown): string {
		console.log("toString", structuredClone(data))
		let result: string
		if (!isoly.TimeSpan.is(data))
			result = ""
		else {
			const span = isoly.TimeSpan.normalize(data)
			if (this.separator == ":")
				result = `${!span.hours ? "" : span.hours.toString(10)}:${
					!span.minutes ? "" : Math.abs(span.minutes).toString()
				}`
			else
				result = (+isoly.TimeSpan.toHours(span).toFixed(2)).toString()
		}
		console.log("toString result:", result)
		return result
	}
	fromString(value: string): Duration | undefined {
		console.log("fromString", structuredClone(value))
		let result: undefined | Duration
		const match = value.match(this.patterns.extract)
		if (!match)
			result = undefined
		else {
			const [value, negative, hours, separator, minutes] = match
			this.separator = separator
			if (separator == ":") {
				const parsed = {
					hours: parseInt(hours),
					minutes: parseInt(minutes),
				}
				result = isoly.TimeSpan.normalize({
					hours: !Number.isFinite(parsed.hours) ? 0 : parsed.hours,
					minutes: !Number.isFinite(parsed.minutes) ? 0 : negative ? parsed.minutes * -1 : parsed.minutes,
				})
			} else {
				const hours = parseFloat(value.replace(",", "."))
				result = isoly.TimeSpan.normalize({
					hours: !Number.isFinite(hours) ? 0 : hours,
				})
			}
		}
		console.log("fromString result:", result)
		return result
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		console.log("format", structuredClone(unformatted.value))
		let result = unformatted
		const [, negative, hours] = unformatted.match(this.patterns.extract) ?? []
		if (!hours)
			result = result.insert(negative ? 1 : 0, "0")
		console.log("format result:", result)
		return { ...result, type: "tel", pattern: this.patterns.allowed }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		console.log("unformat", structuredClone(formatted.value))
		const [, , , separator] = formatted.match(this.patterns.extract) ?? []
		if (separator)
			this.separator = separator
		console.log("unformat result:", formatted.value)
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		console.log("allowed", structuredClone(state.value))
		const nextValue = state.value.slice(0, state.selection.start) + symbol + state.value.slice(state.selection.end)
		const result = !!nextValue.search(this.patterns.allowed)
		console.log("allowed result:", result)
		return result
	}
}
add("duration", () => new Handler())
