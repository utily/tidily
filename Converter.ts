export interface Converter<T> {
	toString(data: T): string
	fromString(value: string): T | undefined
}
