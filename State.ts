import { Selection } from "./Selection"

export interface State {
	value: string
	selection: Selection
	remainder?: string
}
export namespace State {
	export function copy(state: Readonly<State>): State {
		return {
			value: state.value,
			selection: { start: state.selection.start, end: state.selection.end, direction: state.selection.direction },
			remainder: state.remainder,
		}
	}
}
