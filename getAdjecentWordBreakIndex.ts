function getForwardWordBreakIndex(word: string, currentIndex: number, wordRegex: RegExp): number {
	let result = 0
	while (wordRegex.exec(word) != null) {
		result = wordRegex.lastIndex
		if (wordRegex.lastIndex > currentIndex)
			break
	}
	if (wordRegex.lastIndex <= currentIndex)
		result = word.length

	return result
}

function getBackwardWordBreakIndex(word: string, stopIndex: number, wordRegex: RegExp): number {
	let result = 0
	let arr: RegExpExecArray | null
	while ((arr = wordRegex.exec(word)) != null) {
		if (wordRegex.lastIndex - arr[0].length < stopIndex) {
			result = wordRegex.lastIndex - arr[0].length
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
	const wordRegex = /([\wåäöüéáúíóßðœøæñµçþ_]+|[@-]+)/gi
	if (direction == "backward") {
		result = getBackwardWordBreakIndex(word, currentIndex, wordRegex)
	} else {
		result = getForwardWordBreakIndex(word, currentIndex, wordRegex)
	}
	return result
}
