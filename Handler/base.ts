import * as isoly from "isoly"
import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Type } from "../Type"
import { StateEditor } from "../StateEditor"

const handlers: { [type: string]: ((argument?: any[]) => Converter<any> & Formatter) | undefined } = {}
export function add(type: Type, create: (argument?: any[]) => Converter<any> & Formatter): void {
	handlers[type] = create
}

export function get(
	type: "card-csc" | "card-number" | "email" | "password" | "text"
): (Converter<string> & Formatter) | undefined
export function get(type: "card-expires"): (Converter<[number, number]> & Formatter) | undefined
export function get(type: "percent"): (Converter<number> & Formatter) | undefined
export function get(
	type: "phone" | "postal-code",
	country?: isoly.CountryCode.Alpha2
): (Converter<string> & Formatter) | undefined
export function get(type: "price", currency: isoly.Currency): (Converter<number> & Formatter) | undefined
export function get<T>(type: Type, ...argument: any[]): (Converter<T> & Formatter) | undefined
export function get<T>(type: Type, ...argument: any[]): (Converter<T> & Formatter) | undefined {
	const create = handlers[type]
	return create && create(argument)
}
export function format(data: string, type: "card-csc" | "card-number" | "email" | "password" | "text"): string
export function format(data: [number, number], type: "card-expires"): string
export function format(data: number, type: "percent"): string
export function format(data: string, type: "phone" | "postal-code", country?: isoly.CountryCode.Alpha2): string
export function format(data: number, type: "price", currency: isoly.Currency): string
export function format(data: any, type: Type, ...argument: any[]): string
export function format(data: any, type: Type, ...argument: any[]): string {
	const handler = get(type, argument)
	return handler
		? handler.format(StateEditor.modify(handler.toString(typeof data == "string" ? parse(data, type, argument) : data)))
				.value
		: ""
}
export function parse(
	value: string,
	type: "card-csc" | "card-number" | "email" | "password" | "text"
): string | undefined
export function parse(value: string, type: "card-expires"): [number, number] | undefined
export function parse(value: string, type: "percent"): number | undefined
export function parse(
	value: string,
	type: "phone" | "postal-code",
	country?: isoly.CountryCode.Alpha2
): string | undefined
export function parse(value: string, type: "price", currency: isoly.Currency): number | undefined
export function parse(value: string, type: Type, ...argument: any[]): any
export function parse(value: string, type: Type, ...argument: any[]): any {
	const handler = get(type, argument)
	return handler ? handler.fromString(handler.unformat(StateEditor.modify(value)).value) : undefined
}
