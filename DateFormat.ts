import * as isoly from "isoly"
export type DateFormat = "YYYY-mm-dd" | "dd-mm-YYYY" | "mm/dd/YYYY" | "dd/mm/YYYY" | "dd.mm.YYYY"

export namespace DateFormat {
	export function fromLocale(locale: isoly.Locale | undefined): DateFormat {
		let result: DateFormat
		switch (locale) {
			case "sq-AL":
			case "es-AR":
			case "it-IT":
			case "en-GB":
			case "fr-FR":
				result = "dd/mm/YYYY"
				break
			case "en-US":
				result = "mm/dd/YYYY"
				break
			case "et-EE":
			case "de-AT":
			case "de-DE":
			case "he-IL":
			case "is-IS":
			case "lv-LV":
			case "pl-PL":
			case "ru-RU":
			case "fi-FI":
				result = "dd.mm.YYYY"
				break
			case "hi-IN":
			case "en-IN":
				result = "dd-mm-YYYY"
				break
			default:
				result = "YYYY-mm-dd"
				break
		}
		return result
	}
	export function toLocale(format: DateFormat | undefined): isoly.Locale {
		let result: isoly.Locale
		switch (format) {
			case "dd/mm/YYYY":
				result = "en-GB"
				break
			case "mm/dd/YYYY":
				result = "en-US"
				break
			case "dd.mm.YYYY":
				result = "de-DE"
				break
			default:
				result = "sv-SE"
				break
		}
		return result
	}
	export function is(value: DateFormat | any): value is DateFormat {
		return (
			typeof value == "string" &&
			(value == "YYYY-mm-dd" || value == "dd/mm/YYYY" || value == "dd.mm.YYYY" || value == "mm/dd/YYYY")
		)
	}
}
