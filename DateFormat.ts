import * as isoly from "isoly"
export type DateFormat = "YYYY-MM-dd" | "dd/MM/YYYY"

export namespace DateFormat {
	export function fromLocale(locale: DateFormat | isoly.Locale | undefined): DateFormat {
		let result: DateFormat
		switch (locale) {
			default:
				result = "YYYY-MM-dd"
				break
		}
		return result
	}
	export function is(value: DateFormat | any): value is DateFormat {
		return typeof value == "string" && (value == "YYYY-MM-dd" || value == "dd/MM/YYYY")
	}
}
