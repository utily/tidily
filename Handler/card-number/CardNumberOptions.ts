export type Issuer =
	| "amex"
	| "dankort"
	| "diners"
	| "discover"
	| "electron"
	| "interpayment"
	| "jcb"
	| "unionpay"
	| "maestro"
	| "mastercard"
	| "visa"
	| "unknown"

export interface CardNumberOptions {
	forceIssuer?: Issuer
}
