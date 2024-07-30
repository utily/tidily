import * as isoly from "isoly"
import { Settings } from "../../Settings"
import { State } from "../../State"
import { StateEditor } from "../../StateEditor"
import { Base, register } from "./Base"
import { Separator } from "./Separator"

class Handler extends Base {
	constructor(separator: Separator) {
		super(separator)
	}
	toString(data?: isoly.Date | unknown): string {
		return isoly.Date.is(data) && data.length == 10
			? [data.substring(8, 10), data.substring(5, 7), data.substring(0, 4)].join(this.separator)
			: ""
	}
	fromString(value: string): isoly.Date | undefined {
		const result =
			value?.length == 8 ? `${value.substring(4, 8)}-${value.substring(2, 4)}-${value.substring(0, 2)}` : undefined
		return isoly.Date.is(result) ? result : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted.delete(this.separator)
		if (result.get(0, 1) > "3")
			result = result.insert(0, "0")
		if (result.value.length > 1)
			result = result.insert(2, this.separator)
		if (result.get(3, 1) > "1")
			result = result.insert(3, "0")
		if (result.value.length > 4)
			result = result.insert(5, this.separator)
		return {
			...result,
			type: "text",
			length: [0, 10],
			pattern: new RegExp(["^(0[1-9]|[12][0-9]|3[01])", "(0[1-9]|1[012])", "\\d{4}$"].join(this.separator)),
		}
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.selection.start == 1 && state.value[0] == "3" // 2nd digit of day when 1st is 3
			? symbol >= "0" && symbol <= "1"
			: state.selection.start == 1 && state.value[0] == "0" // 2nd digit of day when 1st is 0
			? symbol >= "1" && symbol <= "9"
			: state.selection.start == 2 // first digit of month
			? symbol >= "0" &&
			  symbol <= "9" &&
			  (symbol == "0" || symbol == "1" || this.validMonth(state.value.substring(0, 2), symbol))
			: state.selection.start == 3 // 2nd digit of month
			? symbol >= "0" && symbol <= "9" && this.validMonth(state.value.substring(0, 2), state.value[2] + symbol)
			: state.selection.start == 7 // last digit of year
			? symbol >= "0" &&
			  symbol <= "9" &&
			  this.validMonth(state.value.substring(0, 2), state.value.substring(2, 4), state.value.substring(4, 7) + symbol)
			: state.selection.start < 8 && symbol >= "0" && symbol <= "9"
	}
}
register("dd.mm.YYYY", () => new Handler("."))
register("dd/mm/YYYY", () => new Handler("/"))
register("dd-mm-YYYY", () => new Handler("-"))
