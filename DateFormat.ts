import * as isoly from "isoly"
export type DateFormat = "YYYY-mm-dd" | "mm/dd/YYYY" | "dd/mm/YYYY" | "dd.mm.YYYY"

export namespace DateFormat {
	export function fromLocale(locale: DateFormat | isoly.Locale | undefined): DateFormat {
		let result: DateFormat
		switch (locale) {
			default:
				result = "YYYY-mm-dd"
				break
			case "en-GB":
				result = "dd/mm/YYYY"
				break
			case "en-US":
				result = "mm/dd/YYYY"
				break
			case "de-DE":
			case "pl-PL":
			case "ru-RU":
				result = "dd.mm.YYYY"
				break
		}
		return result
	}
	export function is(value: DateFormat | any): value is DateFormat {
		return typeof value == "string" && (value == "YYYY-mm-dd" || value == "dd/mm/YYYY")
	}
}
