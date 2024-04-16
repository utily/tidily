import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

const modeTypes = ["code", "pascal", "snake", "camel", "attribute"] as const
type Mode = typeof modeTypes[number]

class Handler implements Converter<string>, Formatter {
	constructor(private readonly settings: Omit<Settings, "type">, readonly mode: Mode) {}
	toString(data?: string | unknown): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" && !!value ? value : undefined
	}
	split(unformatted: StateEditor): StateEditor {
		let previousSymbol: string
		return unformatted
			.map((symbol, index) => {
				const newSymbol =
					index !== 0 && symbol === symbol.toUpperCase() && isNaN(+symbol) && previousSymbol !== " "
						? " " + symbol
						: (symbol === "_" || symbol === "-") && previousSymbol !== " "
						? " "
						: symbol === " " && previousSymbol === " "
						? ""
						: symbol
				previousSymbol = symbol
				return newSymbol
			})
			.toLower()
			.delete("-")
			.delete("_")
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const alignedString = this.split(unformatted)
		let result: StateEditor
		switch (this.mode) {
			case "code":
				result = alignedString.delete(" ")
				break
			case "pascal":
			case "camel":
				let previousSpace: boolean
				result = alignedString
					.map((symbol, index) => {
						const newSymbol =
							(index === 0 && this.mode === "pascal") || previousSpace ? symbol.toUpperCase() : symbol.toLowerCase()
						previousSpace = symbol == " "
						return newSymbol
					})
					.delete(" ")
				break
			case "snake":
				result = alignedString.replace(" ", "_").toLower()
				break
			case "attribute":
				result = alignedString.replace(" ", "-").toLower()
				break
			default:
				result = unformatted
		}
		return { ...result, ...this.settings, type: "text", autocomplete: "on" }
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return (
			(symbol >= "A" && symbol <= "Z") ||
			(symbol >= "a" && symbol <= "z") ||
			(symbol >= "0" && symbol <= "9" && (this.mode == "code" || state.value.length > 0)) ||
			(symbol == "_" && this.mode == "snake" && state.value.length > 0) ||
			(symbol == "-" && this.mode == "attribute" && state.value.length > 0)
		)
	}
}
add("identifier-code", (settings?: any) => new Handler(settings || {}, "code"))
add("identifier-pascal", (settings?: any) => new Handler(settings || {}, "pascal"))
add("identifier-snake", (settings?: any) => new Handler(settings || {}, "snake"))
add("identifier-camel", (settings?: any) => new Handler(settings || {}, "camel"))
add("identifier-attribute", (settings?: any) => new Handler(settings || {}, "attribute"))
