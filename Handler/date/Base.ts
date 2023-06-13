import * as isoly from "isoly"
import { Converter } from "../../Converter"
import { DateFormat } from "../../DateFormat"
import { Formatter } from "../../Formatter"
import { Settings } from "../../Settings"
import { State } from "../../State"
import { StateEditor } from "../../StateEditor"
import { add } from "../base"
import { Separator } from "./Separator"

export abstract class Base implements Converter<string>, Formatter {
	constructor(readonly separator: Separator) {}
	abstract toString(data: isoly.Date | any): string
	abstract fromString(value: string): isoly.Date | undefined
	abstract format(unformatted: StateEditor): Readonly<State> & Settings
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(this.separator)
	}
	abstract allowed(symbol: string, state: Readonly<State>): boolean
	protected daysInMonth(value: string): number {
		return (
			32 -
			Number.parseInt(
				isoly.Date.next((this.fromString(value.padEnd(8, "1")) ?? "1970-01-01").substring(0, 8) + "28", 4).substring(
					8,
					10
				)
			)
		)
	}
	protected validMonth(day: string, month: string, year?: string): boolean {
		return (
			new Date(Number.parseInt(year ?? "2004" /* must be leap year */), Number.parseInt(month), 0).getDate() >=
			Number.parseInt(day)
		)
	}
}
const handlers: { [format in DateFormat]?: () => Converter<string> & Formatter } = {}
export function register(format: DateFormat, create: () => Converter<string> & Formatter) {
	handlers[format] = create
}
add("date", (dateFormatOrLocale: DateFormat | isoly.Locale) => {
	const format = DateFormat.is(dateFormatOrLocale) ? dateFormatOrLocale : DateFormat.fromLocale(dateFormatOrLocale)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const create = handlers[format] ?? handlers["YYYY-mm-dd"]! // assume that fallback format always exists
	return create()
})
