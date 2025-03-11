import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

export interface IntegerOptions {
	min?: number
	max?: number
}

class Handler implements Converter<number>, Formatter {
	readonly min: number | undefined
	readonly max: number | undefined
	constructor(options: IntegerOptions) {
		this.min = options.min
		this.max = options.max
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
		if (this.min != undefined || this.max != undefined) {
			const value = this.fromString(result.value)
			let strValue = ""
			if (value != undefined) {
				if (this.min != undefined && value < this.min) {
					strValue = this.toString(this.min)
				} else if (this.max != undefined && value > this.max) {
					strValue = this.toString(this.max)
				}
			}
			return { ...result, value: strValue }
		}
		return result
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return symbol >= "0" && symbol <= "9"
	}
}
add("integer", (argument?: any[]) => new Handler(argument?.[0] ?? {}))
