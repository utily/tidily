import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data: isoly.DateTime | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): isoly.DateTime | undefined {
		let result: string | isoly.DateTime | undefined = value.replace(" ", "T")
		const fillerDate = "0000-01-01T00:00:00.000Z"
		if (result?.match(/-\d$/))
			result = result.substring(0, result.length - 1) + "0" + result.substring(result.length - 1, result.length)
		result = !result.match(/^\d{4}-(0[1-9]|1[012])/)
			? undefined
			: result + fillerDate.substring(result.length, fillerDate.length)
		return isoly.DateTime.is(result) ? result : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		const regex =
			/^(\d{4})(?:-(0[1-9]|1[012]))?(?:-(0[1-9]|[12][0-9]|3[01]))?(?: - (\d{4})(?:-(0[1-9]|1[012]))?(?:-(0[1-9]|[12][0-9]|3[01]))?)?/

		const matches = unformated.match(regex)
		let result = unformated
		if (matches) {
			console.log(unformated.match(regex))

			if (result.match(/^(?:19|20)\d{2}$/))
				result = result.insert(5, "-")

			if (result.match(/^(?:19|20)\d{2}-(?:0[1-9]|1[012])$/))
				result = result.insert(8, "-")

			if (result.match(/^(?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01])$/))
				result = result.insert(11, " - ")

			if (result.match(/^(?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]) - (?:19|20)\d{2}$/))
				result = result.insert(19, "-")

			if (
				result.match(/^(?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]) - (?:19|20)\d{2}-(?:0[1-9]|1[012])$/)
			)
				result = result.insert(22, "-")

			if (
				!result.match(
					/^(?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]) - (?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01])$/
				) &&
				result.match(
					/^(?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]) - (?:19|20)\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]).*$/
				)
			) {
				result = result.replace(23, 24, "")
			}
		}

		return {
			...result,
			type: "text",
			length: [0, 23],
			pattern: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) - \d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		return state.value.length <= 23 && ((symbol >= "0" && symbol <= "9") || symbol == "-" || symbol == " ")
	}
}
add("date-range", () => new Handler())
