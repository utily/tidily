const letters = /[\wåäöüéáúíóßðœøæñµçþ]+/gi

function getForwardWordBreakIndex(word: string, currentIndex: number): number {
	let result = 0
	while (letters.exec(word) != null) {
		result = letters.lastIndex
		if (letters.lastIndex > currentIndex)
			break
	}
	if (letters.lastIndex <= currentIndex)
		result = word.length

	return result
}

function getBackwardWordBreakIndex(word: string, stopIndex: number): number {
	let result = 0
	let arr: RegExpExecArray | null
	while ((arr = letters.exec(word)) != null) {
		if (letters.lastIndex - arr[0].length < stopIndex) {
			result = letters.lastIndex - arr[0].length
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
