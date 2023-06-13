import { Converter } from "./Converter"
import { Formatter } from "./Formatter"

export interface Handler<T> extends Converter<T>, Formatter {}
