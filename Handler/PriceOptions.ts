import { isoly } from "isoly"

export interface PriceOptions {
	currency?: isoly.Currency
	toInteger?: boolean
	variant?: "long" | "short"
}
