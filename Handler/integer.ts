import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"
import { IntegerOptions } from "./IntegerOptions"

class Handler implements Converter<number>, Formatter {
	readonly min: number | undefined
	readonly max: number | undefined
	readonly pad: number | undefined
	constructor(options: IntegerOptions) {
		this.min = options.min
		this.max = options.max
		this.pad = options.pad
	}
	toString(data?: number | unknown): string {
		return typeof data == "number" ? data.toString() : ""
	}
	fromString(value: string): number | undefined {
		const parsed = typeof value == "string" ? Number.parseInt(value) : undefined
		return typeof parsed == "number" && !Number.isNaN(parsed) ? parsed : undefined
	}

	partialFormat(unformatted: StateEditor): Readonly<State> & Settings {
		return {
			...unformatted,
			type: "text",
			inputmode: "numeric",
			length: [3, undefined],
			pattern: /^[0-9]+$/,
		}
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const result = this.partialFormat(unformatted)
		const number = this.fromString(result.value)
		const value =
			number == undefined
				? result.value
				: this.min != undefined && number < this.min
				? this.toString(this.min)
				: this.max != undefined && number > this.max
				? this.toString(this.max)
				: result.value
		return {
			...result,
			value: typeof this.pad == "number" && value ? value.padStart(this.pad, "0") : value,
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			symbol >= "0" &&
			symbol <= "9" &&
			(this.max == undefined ||
				this.max.toString().length > state.value.length ||
				state.selection.start != state.selection.end)
		)
	}
}
add("integer", (argument?: any[]) => new Handler(argument?.[0] ?? {}))
