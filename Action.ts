import { Formatter } from "./Formatter"
import { getAdjecentWordBreakIndex } from "./getAdjecentWordBreakIndex"
import { Settings } from "./Settings"
import { State } from "./State"
import { StateEditor } from "./StateEditor"

export interface Action {
	key: string
	repeat?: boolean
	ctrlKey?: boolean
	shiftKey?: boolean
	altKey?: boolean
	metaKey?: boolean
}

function showString(str: string, index: number) {
	console.log(str)
	let pointerString = ""
	for (let i = 0; i <= index; i++) {
		pointerString += i != index ? " " : "^"
	}
	console.log(pointerString)
}

export namespace Action {
	export function apply(
		formatter: Formatter,
		state: Readonly<State>,
		action?: Action
	): Readonly<State> & Readonly<Settings> {
		let result = State.copy(formatter.unformat(StateEditor.copy(state)))

		if (action) {
			if (action.ctrlKey) {
				if (action.key == "a")
					selectAll(formatter, state)
				else if (["ArrowLeft", "ArrowRight"].includes(action.key) && (state as any)?.type != "password")
					result = ctrlArrow(formatter, state, action)
				else if (["Delete", "Backspace"].includes(action.key) && (state as any)?.type != "password")
					result = ctrlDeleteAction(formatter, state, action)
			} else {
				if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(action.key))
					result = arrowHomeEnd(formatter, state, action)
				else {
					if (result.selection.start != result.selection.end) {
						// selection exists
						action = ["Delete", "Backspace"].includes(action.key) ? undefined : action
						result.value =
							result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
						result.selection.end = result.selection.start
					}
					if (action) {
						switch (action.key) {
							case "Unidentified":
								break
							case "Backspace":
								if (result.selection.start > 0) {
									result.value =
										result.value.substring(0, result.selection.start - 1) +
										result.value.substring(result.selection.start)
									result.selection.start = --result.selection.end
								}
								break
							case "Delete":
								if (result.selection.start < result.value.length)
									result.value =
										result.value.substring(0, result.selection.start) +
										result.value.substring(result.selection.start + 1)
								break
							default:
								if (formatter.allowed(action.key, result)) {
									result.value =
										result.value.substring(0, result.selection.start) +
										action.key +
										result.value.substring(result.selection.start)
									result.selection.start = result.selection.end += action.key.length
								}
						}
					}
				}
			}
		}
		return formatter.format(StateEditor.copy(result))
	}

	function ctrlArrow(formatter: Formatter, state: Readonly<State>, action: Action): Readonly<State> {
		let cursorPosition = state.selection.direction == "backward" ? state.selection.start : state.selection.end
		let otherPosition = cursorPosition == state.selection.start ? state.selection.end : state.selection.start
		cursorPosition = getAdjecentWordBreakIndex(
			state.value,
			cursorPosition,
			action.key == "ArrowLeft" ? "backward" : "forward"
		)
		otherPosition = action.shiftKey ? otherPosition : cursorPosition

		return State.copy(
			formatter.unformat(
				StateEditor.copy({
					...state,
					selection: {
						start: Math.min(otherPosition, cursorPosition),
						end: Math.max(otherPosition, cursorPosition),
						direction:
							otherPosition < cursorPosition ? "forward" : otherPosition > cursorPosition ? "backward" : "none",
					},
				})
			)
		)
	}
	function arrowHomeEnd(formatter: Formatter, state: Readonly<State>, action: Action): Readonly<State> {
		const result = State.copy(formatter.unformat(StateEditor.copy(state)))
		let cursorPosition = result.selection.direction == "backward" ? result.selection.start : result.selection.end
		let otherPosition = cursorPosition == result.selection.start ? result.selection.end : result.selection.start
		cursorPosition =
			action.key == "Home"
				? 0
				: action.key == "End"
				? result.value.length
				: result.selection.start == result.selection.end || action.shiftKey
				? Math.min(Math.max(cursorPosition + (action.key == "ArrowLeft" ? -1 : 1), 0), result.value.length)
				: action.key == "ArrowLeft"
				? result.selection.start
				: result.selection.end
		otherPosition = action.shiftKey ? otherPosition : cursorPosition
		result.selection.direction =
			otherPosition < cursorPosition ? "forward" : otherPosition > cursorPosition ? "backward" : "none"
		result.selection.start = Math.min(otherPosition, cursorPosition)
		result.selection.end = Math.max(otherPosition, cursorPosition)
		return result
	}
	function selectAll(formatter: Formatter, state: Readonly<State>): Readonly<State> {
		const result = State.copy(formatter.unformat(StateEditor.copy(state)))
		result.selection.start = 0
		result.selection.end = result.value.length
		result.selection.direction = "forward"
		return result
	}

	function ctrlDeleteAction(formatter: Formatter, state: Readonly<State>, action: Action): Readonly<State> {
		const cursorPosition = state.selection.direction == "backward" ? state.selection.start : state.selection.end
		const adjecentIndex = getAdjecentWordBreakIndex(
			state.value,
			cursorPosition,
			action.key == "Backspace" ? "backward" : "forward"
		)
		const result = State.copy(
			formatter.unformat(
				StateEditor.copy({
					...state,
					selection: {
						start: Math.min(cursorPosition, adjecentIndex),
						end: Math.max(cursorPosition, adjecentIndex),
						direction: "none",
					},
				})
			)
		)
		result.value = result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
		result.selection.end = result.selection.start
		return result
	}
}
