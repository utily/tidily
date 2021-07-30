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
			if (action.key == "ArrowLeft" || action.key == "ArrowRight" || action.key == "Home" || action.key == "End") {
				if (
					action.ctrlKey &&
					(action.key == "ArrowLeft" || action.key == "ArrowRight") &&
					(state as any)?.type != "password"
				) {
					let cursorPosition = state.selection.direction == "backward" ? state.selection.start : state.selection.end
					let otherPosition = cursorPosition == state.selection.start ? state.selection.end : state.selection.start
					console.log("----cursorPosition", cursorPosition)
					showString(state.value, cursorPosition)
					cursorPosition = getAdjecentWordBreakIndex(
						state.value,
						cursorPosition,
						action.key == "ArrowLeft" ? "backward" : "forward"
					)
					console.log("----cursorPosition", cursorPosition)
					showString(state.value, cursorPosition)
					otherPosition = action.shiftKey ? otherPosition : cursorPosition
					result = State.copy(
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
				} else {
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
				}
			} else if (action.ctrlKey) {
				if (action.key == "a") {
					result.selection.start = 0
					result.selection.end = result.value.length
					result.selection.direction = "forward"
				} else if ((action.key == "Delete" || action.key == "Backspace") && (state as any)?.type != "password") {
					// delete until wordbreak
					const cursorPosition = state.selection.direction == "backward" ? state.selection.start : state.selection.end
					console.log("----cursorPosition", cursorPosition)
					showString(state.value, cursorPosition)
					const adjecentIndex = getAdjecentWordBreakIndex(
						state.value,
						cursorPosition,
						action.key == "Backspace" ? "backward" : "forward"
					)
					console.log("----adjecentIndex", adjecentIndex)
					showString(state.value, adjecentIndex)
					result = State.copy(
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
					result.value =
						result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
					result.selection.end = result.selection.start
				}
			} else {
				if (result.selection.start != result.selection.end) {
					// selection exists
					switch (action.key) {
						case "Delete":
						case "Backspace":
							action = undefined
							break
						default:
							break
					}
					result.value =
						result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
					result.selection.end = result.selection.start
				}
				if (action)
					switch (action.key) {
						case "Unidentified":
							break
						case "Backspace":
							if (result.selection.start > 0) {
								result.value =
									result.value.substring(0, result.selection.start - 1) + result.value.substring(result.selection.start)
								result.selection.start = --result.selection.end
							}
							break
						case "Delete":
							if (result.selection.start < result.value.length)
								result.value =
									result.value.substring(0, result.selection.start) + result.value.substring(result.selection.start + 1)
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
		return formatter.format(StateEditor.copy(result))
	}
}
