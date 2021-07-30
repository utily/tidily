function getForwardWordBreakIndex(word: string, currentIndex: number): number {
	const reg = /\w+/g
	let result = 0
	while (reg.exec(word) != null) {
		result = reg.lastIndex
		if (reg.lastIndex > currentIndex)
			break
	}
	if (reg.lastIndex <= currentIndex)
		result = word.length

	return result
}

function getBackwardWordBreakIndex(word: string, stopIndex: number): number {
	const reg = /\w+/g
	let result = 0
	let arr: RegExpExecArray | null
	while ((arr = reg.exec(word)) != null) {
		if (reg.lastIndex - arr[0].length < stopIndex) {
			result = reg.lastIndex - arr[0].length
		} else {
			break
		}
	}

	return result
}

export function getAdjecentWordBreakIndex(
	word: string,
	currentIndex: number,
	direction: "backward" | "forward"
): number {
	let result = 0
	if (direction == "backward") {
		result = getBackwardWordBreakIndex(word, currentIndex)
	} else {
		result = getForwardWordBreakIndex(word, currentIndex)
	}
	return result
}
