import { isoly } from "isoly"
import { Converter } from "../Converter"
import { DateFormat } from "../DateFormat"
import { Formatter } from "../Formatter"
import { StateEditor } from "../StateEditor"
import { Type } from "../Type"
import { IntegerOptions } from "./integer"
import { PriceOptions } from "./price"

const handlers: { [type: string]: ((argument?: any[]) => Converter<any> & Formatter) | undefined } = {}
export function add(type: Type, create: (argument?: any[]) => Converter<any> & Formatter): void {
	handlers[type] = create
}

export function get(
	type: "card-csc" | "card-number" | "date" | "date-time" | "email" | "password" | "text",
	format: DateFormat | isoly.Locale
): (Converter<string> & Formatter) | undefined
export function get(type: "card-expires"): (Converter<[number, number]> & Formatter) | undefined
export function get(type: "divisor"): (Converter<number | [number, number]> & Formatter) | undefined
export function get(type: "percent"): (Converter<number> & Formatter) | undefined
export function get(
	type: "identity-number" | "phone" | "postal-code",
	country?: isoly.CountryCode.Alpha2
): (Converter<string> & Formatter) | undefined
export function get(type: "price", currency: isoly.Currency | PriceOptions): (Converter<number> & Formatter) | undefined
export function get(type: "date", format?: DateFormat | isoly.Locale): (Converter<isoly.Date> & Formatter) | undefined
export function get<T>(type: Type, ...argument: any[]): (Converter<T> & Formatter) | undefined
export function get<T>(type: Type, ...argument: any[]): (Converter<T> & Formatter) | undefined {
	const create = handlers[type]
	return create && create(argument)
}
export function format(data: string, type: "card-csc" | "card-number" | "email" | "password" | "text"): string
export function format(data: [number, number], type: "card-expires"): string
export function format(data: isoly.Date, type: "date", format?: DateFormat | isoly.Locale): string
export function format(data: isoly.DateTime, type: "date-time"): string
export function format(data: number | [number, number], type: "divisor"): string
export function format(data: number, type: "percent"): string
export function format(
	data: string,
	type: "identity-number" | "phone" | "postal-code",
	country?: isoly.CountryCode.Alpha2
): string
export function format(data: number, type: "price", currency: isoly.Currency | PriceOptions): string
export function format(data: number, type: "integer", options: IntegerOptions): string
export function format(data: any, type: Type, ...argument: any[]): string
export function format(data: any, type: Type, ...argument: any[]): string {
	const handler = get(type, ...argument)
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
export function parse(value: string, type: "date", format?: DateFormat | isoly.Locale): isoly.Date | undefined
export function parse(value: string, type: "date-time"): isoly.DateTime | undefined
export function parse(value: string, type: "divisor"): number | [number, number]
export function parse(value: string, type: "percent"): number | undefined
export function parse(
	value: string,
	type: "identity-number" | "phone" | "postal-code",
	country?: isoly.CountryCode.Alpha2
): string | undefined
export function parse(value: string, type: "price", currency: isoly.Currency): number | undefined
export function parse(value: string, type: Type, ...argument: any[]): any
export function parse(value: string, type: Type, ...argument: any[]): any {
	const handler = get(type, argument)
	return handler ? handler.fromString(handler.unformat(StateEditor.modify(value)).value) : undefined
}
