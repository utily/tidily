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
add("date", (parameters?: any[]) => {
	const argument = parameters && parameters.length > 0 ? parameters[0] : undefined
	const format = DateFormat.is(argument) ? argument : DateFormat.fromLocale(argument)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const create = handlers[format] ?? handlers["YYYY-mm-dd"]! // assume that fallback format always exists
	return create()
})
