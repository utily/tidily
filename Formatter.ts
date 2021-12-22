import * as isoly from "isoly"
import { DateFormat } from "./DateFormat"
import { Settings } from "./Settings"
import { State } from "./State"
import { StateEditor } from "./StateEditor"
export interface Formatter {
	format(data: StateEditor, format?: DateFormat | isoly.Locale): Readonly<State> & Settings
	unformat(value: StateEditor, format?: DateFormat | isoly.Locale): Readonly<State>
	allowed(symbol: string, state: Readonly<State>, format?: DateFormat | isoly.Locale): boolean
}
