import { Direction } from "./Direction"
export interface Selection {
	start: number
	end: number
	direction?: Direction
}

export namespace Selection {
	export function getCursor(selection: Selection): number {
		return selection.direction == "backward" ? selection.start : selection.end
	}
	export function getStalker(selection: Selection): number {
		return selection.direction != "backward" ? selection.start : selection.end
	}
}
