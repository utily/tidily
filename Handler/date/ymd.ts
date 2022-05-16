import * as isoly from "isoly"
import { Settings } from "../../Settings"
import { State } from "../../State"
import { StateEditor } from "../../StateEditor"
import { Base, register } from "./Base"
import { Seperator } from "./Seperator"

class Handler extends Base {
	constructor(seperator: Seperator) {
		super(seperator)
	}
	toString(data: isoly.Date | any): string {
		return typeof data != "string" ? "" : data
	}
	fromString(value: string): isoly.Date | undefined {
		const result =
			value?.length == 8 ? `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}` : undefined
		return isoly.Date.is(result) ? result : undefined
	}
	format(unformatted: StateEditor): Readonly<State> & Settings {
		let result = unformatted
		if (result.value.length > 3) {
			result = result.insert(4, this.seperator)
			if (result.get(5, 1) > "1")
				result = result.insert(5, "0")
			if (result.value.length > 6) {
				result = result.insert(7, this.seperator)
				if (result.get(8, 1) > this.daysInMonth(unformatted.value).toString().substring(0, 1))
					result = result.insert(8, "0")
			}
		}
		return {
			...result,
			type: "text",
			length: [0, 10],
			pattern: new RegExp(["^\\d{4}", "(0[1-9]|1[012])", "(0[1-9]|[12][0-9]|3[01])$"].join(this.seperator)),
		}
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const daysInMonth = this.daysInMonth(state.value)
		return state.selection.start == 5 && state.value[4] == "0"
			? symbol >= "1" && symbol <= "9"
			: state.selection.start == 5 && state.value[4] == "1"
			? symbol >= "0" && symbol <= "2"
			: state.selection.start == 7 && state.value[6] == "0"
			? symbol >= "1" && symbol <= "9"
			: state.selection.start == 7 && ((state.value[6] == "2" && daysInMonth < 30) || state.value[6] == "3")
			? symbol >= "0" && symbol <= daysInMonth.toString().substring(1)
			: state.selection.start < 8 && symbol >= "0" && symbol <= "9"
	}
}
register("YYYY-mm-dd", () => new Handler("-"))
