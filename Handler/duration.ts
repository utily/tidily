import { isoly } from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<isoly.TimeSpan>, Formatter {
	private separator = ":"
	private patterns = {
		//           hours |    "normal" minutes     | decimal minutes
		allowed: /^-?\d*(?::{0,1}[0-5]{0,1}[0-9]{0,1}|[.,]{0,1}[0-9]{0,2})$/,
		extract: /^(-?)(\d*)([:,.]{0,1})([0-9]{0,2})$/,
		zeros: /^(-?)(0+)(?:[1-9]|0[,.:]?)/,
	}
	toString(data?: isoly.TimeSpan | unknown): string {
		let result: string
		if (!isoly.TimeSpan.is(data))
			result = ""
		else {
			const span = isoly.TimeSpan.normalize(data)
			if (!span.minutes && !span.hours)
				result = ""
			else if (this.separator != ":")
				result = (+isoly.TimeSpan.toHours(span).toFixed(2) || "").toString(10)
			else if (span.hours && !span.minutes)
				result = span.hours.toString(10)
			else if (!span.hours && span.minutes)
				result = `${span.minutes < 0 ? "-" : ""}0:${Math.abs(span.minutes).toString(10)}`
			else
				result = `${span.hours?.toString(10)}:${Math.abs(span.minutes ?? 0).toString(10)}`
		}
		return result
	}
	fromString(value: string): isoly.TimeSpan | undefined {
		let result: undefined | isoly.TimeSpan
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
				const multiplicand = negative ? -1 : 1
				result = isoly.TimeSpan.normalize({
					hours: !Number.isFinite(parsed.hours) ? 0 : parsed.hours * multiplicand,
					minutes: !Number.isFinite(parsed.minutes) ? 0 : parsed.minutes * multiplicand,
				})
			} else {
				const hours = parseFloat(value.replace(",", "."))
				result = isoly.TimeSpan.normalize({
					hours: !Number.isFinite(hours) ? 0 : hours,
				})
			}
		}
		return result
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		const [, negative, hours, separator] = unformatted.match(this.patterns.extract) ?? []
		if (!hours && separator)
			result = result.insert(negative ? 1 : 0, "0")
		const match = result.match(this.patterns.zeros)
		if (match) {
			const [, negative, zeros] = match
			if (zeros) {
				const offset = negative ? 1 : 0
				result = result.delete(offset, zeros.length + offset)
			}
		}
		return { ...result, type: "tel", pattern: this.patterns.allowed }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		const [, , , separator] = formatted.match(this.patterns.extract) ?? []
		if (separator)
			this.separator = separator
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const nextValue = state.value.slice(0, state.selection.start) + symbol + state.value.slice(state.selection.end)
		return !!nextValue.match(this.patterns.allowed)
	}
}
add("duration", () => new Handler())
