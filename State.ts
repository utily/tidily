import { Selection } from "./Selection"

export interface State {
	value: string
	selection: Selection
}
export namespace State {
	export function copy(state: Readonly<State>): State {
		return {
			value: state.value,
			selection: { start: state.selection.start, end: state.selection.end, direction: state.selection.direction },
		}
	}
	export function merge(...states: ({ value: string; selection: Partial<Selection> } | string)[]): State {
		const result = states.reduce<{ value: string; selection: Partial<Selection> }>(
			(r, state) => ({
				value: r.value + (typeof state == "string" ? state : state.value),
				selection: {
					start:
						r.selection.start ??
						(typeof state != "string" && state.selection.start != undefined
							? state.selection.start + r.value.length
							: undefined),
					end:
						r.selection.end ??
						(typeof state != "string" && state.selection.end != undefined
							? state.selection.end + r.value.length
							: undefined),
				},
			}),
			{
				value: "",
				selection: {},
			}
		)
		return { value: result.value, selection: { start: 0, end: 0, ...result.selection } }
	}
}
