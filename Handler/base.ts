import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Type } from "../Type"
import { StateEditor } from "../StateEditor"

const handlers: { [type: string]: ((argument?: any[]) => Converter<any> & Formatter) | undefined } = {}
export function add(type: Type, create: (argument?: any[]) => Converter<any> & Formatter): void {
	handlers[type] = create
}

export function get(type: "card-csc"): Converter<[number, number]> & Formatter | undefined
export function get(type: "card-expires"): Converter<[number, number]> & Formatter | undefined
export function get(type: "card-number"): Converter<[number, number]> & Formatter | undefined
export function get(type: "password"): Converter<[number, number]> & Formatter | undefined
export function get(type: "percent"): Converter<[number, number]> & Formatter | undefined
export function get(type: "phone"): Converter<[number, number]> & Formatter | undefined
export function get(type: "postal-code"): Converter<[number, number]> & Formatter | undefined
export function get(type: "price"): Converter<[number, number]> & Formatter | undefined
export function get(type: "text"): Converter<[number, number]> & Formatter | undefined
export function get<T>(type: Type, ...argument: any[]): Converter<T> & Formatter | undefined
export function get<T>(type: Type, ...argument: any[]): Converter<T> & Formatter | undefined {
	const create = handlers[type]
	return create && create(argument)
}
export function format(data: [number, number], type: "card-csc") : string
export function format(data: [number, number], type: "card-expires") : string
export function format(data: [number, number], type: "card-number") : string
export function format(data: [number, number], type: "password") : string
export function format(data: [number, number], type: "percent") : string
export function format(data: [number, number], type: "phone") : string
export function format(data: [number, number], type: "postal-code") : string
export function format(data: [number, number], type: "price") : string
export function format(data: [number, number], type: "text") : string
export function format(data: any, type: Type, ...argument: any[]): string {
	const handler = get(type, argument)
	return handler ? handler.format(StateEditor.modify(handler.toString(data))).value : ""
}
export function parse(value: string, type: "card-csc"): [number, number] | undefined
export function parse(value: string, type: "card-expires"): [number, number] | undefined
export function parse(value: string, type: "card-number"): [number, number] | undefined
export function parse(value: string, type: "password"): [number, number] | undefined
export function parse(value: string, type: "percent"): [number, number] | undefined
export function parse(value: string, type: "phone"): [number, number] | undefined
export function parse(value: string, type: "postal-code"): [number, number] | undefined
export function parse(value: string, type: "price"): [number, number] | undefined
export function parse(value: string, type: "text"): [number, number] | undefined
export function parse(value: string, type: Type, ...argument: any[]): any {
	const handler = get(type, argument)
	return handler ? handler.fromString(handler.unformat(StateEditor.modify(value)).value) : undefined
}
