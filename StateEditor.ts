import { State } from "./State"
import { Selection } from "./Selection"

export class StateEditor implements Readonly<State> {
	readonly value: string
	readonly selection: Readonly<Selection>
	private constructor(state: Readonly<State>) {
		this.value = state.value
		this.selection = { start: state.selection.start, end: state.selection.end }
	}

	get(index: number): string {
		return this.value[index]
	}
	is(index: number, character: string | string[]) {
		const c = this.get(index)
		return typeof character == "string" ? c == character : character.some(d => c == d)
	}
	isDigit(index: number): boolean {
		const character = this.get(index)
		return character >= "0" && character <= "9"
	}
	match(matcher: { [Symbol.match](value: string): RegExpMatchArray | null }): RegExpMatchArray | null {
		return this.value.match(matcher)
	}
	replace(needle: string, value: string): StateEditor
	replace(start: number, end: number, value: string): StateEditor
	replace(start: number | string, end: number | string, value?: string): StateEditor {
		let result: StateEditor | undefined
		if (typeof start == "string" && typeof end == "string") {
			let s: number
			result = this
			while ((s = result.value.search(start)) > -1)
				result = result.replace(s, s + start.length, end)
		} else if (typeof start == "number" && typeof end == "number") {
			const state = { value: this.value, selection: { start: this.selection.start, end: this.selection.end } }
			if (!value)
				value = ""
			state.value = this.value.slice(0, start) + value + this.value.slice(end, this.value.length)
			if (this.selection.start >= end)
				state.selection.start = this.selection.start + value.length - end + start
			else if (this.selection.start > start && this.selection.start < end)
				state.selection.start = Math.min(this.selection.start, start + value.length)
			if (this.selection.end >= end)
				state.selection.end = this.selection.end + value.length - end + start
			else if (this.selection.end > start && this.selection.end < end)
				state.selection.end = Math.min(this.selection.end, start + value.length)
			result = new StateEditor(state)
		}
		return result || this
	}
	insert(index: number, value: string): StateEditor {
		return this.replace(index, index, value)
	}
	append(value: string): StateEditor {
		return this.insert(this.value.length, value)
	}
	prepend(value: string): StateEditor {
		return this.insert(0, value)
	}
	delete(needle: string): StateEditor
	delete(start: number, end?: number): StateEditor
	delete(start: number | string, end?: number): StateEditor {
		let result: StateEditor
		if (typeof start == "string") {
			let s: number
			result = this
			while ((s = result.value.search(start)) > -1)
				result = result.delete(s, s + start.length)
		} else
			result = this.replace(start, end || start + 1, "")
		return result
	}
	truncate(end: number): StateEditor {
		if (this.value.length >= end) {
			this.delete(end, this.value.length)
		}
		return this
	}
	pad(length: number, padding: string, index: number): StateEditor {
		while (length > this.value.length + padding.length)
			this.insert(index, padding)
		if (length > this.value.length)
			this.insert(index, padding.substring(0, length - this.value.length))
		return this
	}
	padEnd(length: number, padding: string): StateEditor {
		return this.pad(length, padding, this.value.length)
	}
	padStart(length: number, padding: string): StateEditor {
		return this.pad(length, padding, 0)
	}
	map(mapping: (symbol: string, index: number) => string): StateEditor {
		// tslint:disable-next-line: no-this-assignment
		let result: StateEditor = this
		let j = 0
		for (let i = 0; i < this.value.length; i++) {
			const replacement = mapping(this.get(i), i)
			result = result.replace(j, j + 1, replacement)
			j += replacement.length
		}
		return result
	}

	toState(): State { return { value: this.value, selection: { start: this.selection.start, end: this.selection.end } } }

	static copy(state: Readonly<State>): StateEditor {
		return new StateEditor({ ...state })
	}
	static create(): StateEditor {
		return new StateEditor({ value: "", selection: { start: 0, end: 0 } })
	}
	static modify(state: State | string): StateEditor {
		return new StateEditor(typeof state == "string" ? { value: state, selection: { start: state.length, end: state.length } } : state)
	}
}
