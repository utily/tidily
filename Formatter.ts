import { State } from "./State"
import { StateEditor } from "./StateEditor"
import { Settings } from "./Settings"

export interface Formatter {
	format(data: StateEditor): Readonly<State> & Settings
	unformat(value: StateEditor): Readonly<State>
	allowed(symbol: string, state: Readonly<State>): boolean
}
