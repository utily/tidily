import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { Settings } from "../Settings"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data?: string | unknown): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" && !!value ? value : undefined
	}
	partialFormat = this.format
	format(unformatted: StateEditor): Readonly<State> & Settings {
		const issuer = getIssuer(unformatted.value)
		const result = unformatted.map(
			(symbol, index) => (index + 1 < issuer.length[0] && issuer.spaceIndexes.includes(index) ? " " : "") + symbol
		)
		return {
			...result,
			type: "text",
			inputmode: "numeric",
			autocomplete: "cc-number",
			length: issuer.length.slice(1) as [number | undefined, number | undefined],
			pattern: issuer.verification,
			classes: ["issuer-" + issuer.icon],
		}
	}
	unformat(formatted: StateEditor): Readonly<State> {
		return formatted.delete(" ")
	}
	allowed(symbol: string, state: Readonly<State>): boolean {
		const issuer = getIssuer(state.value)
		return symbol >= "0" && symbol <= "9" && state.value.length < issuer.length[0]
	}
}
add("card-number", () => new Handler())

interface CardIssuer {
	name: string
	verification: RegExp
	spaceIndexes: number[]
	identification: RegExp
	length: [number, number, number] // Max unformatted, min formatted, max formatted
	icon: string
}
function getIssuer(value: string): CardIssuer & { name: string } {
	let result: CardIssuer & { name: string } = defaultIssuer
	if (default14DigitIssuer.identification.test(value))
		result = default14DigitIssuer
	for (const key in issuers)
		if (Object.prototype.hasOwnProperty.call(issuers, key) && issuers[key].identification.test(value)) {
			result = { ...defaultIssuer, name: key, ...issuers[key] }
			break
		}
	return result
}
const default14DigitIssuer: CardIssuer = {
	name: "unknown14DigitIssuer",
	verification: /^\d{4}\s\d{6}\s\d{4}$/,
	spaceIndexes: [4, 10],
	identification: /^\d{14}$/,
	length: [14, 16, 16],
	icon: "generic",
}
const defaultIssuer: CardIssuer = {
	name: "unknown",
	verification: /^\d{19}$/,
	spaceIndexes: [4, 8, 12],
	identification: /^\d/,
	length: [16, 16, 19],
	icon: "generic",
}
const issuers: { [name: string]: Partial<CardIssuer> & { identification: RegExp } } = {
	amex: {
		verification: /^3[47][0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{3}$/,
		identification: /^3[47]/,
		length: [15, 18, 18],
		icon: "amex",
	},
	dankort: {
		verification: /^(5019)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^(5019)\d+/,
		length: [16, 19, 19],
		icon: "generic",
	},
	diners: {
		verification: /^3(?:0[0-5]|[68][0-9])[0-9]\s[0-9]{6}\s[0-9]{4}$/,
		identification: /^3(?:0[0-5]|[68][0-9])/,
		spaceIndexes: [4, 10],
		length: [14, 16, 16],
		icon: "diners",
	},
	discover: {
		verification: /^6(?:011|5[0-9]{2})\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^6(?:011|5[0-9]{2})/,
		length: [16, 19, 19],
		icon: "generic",
	},
	electron: {
		verification:
			/^((4026|4405|4508|4844|4913|4917)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|((4175)\s(00)[0-9]{2}\s[0-9]{4}\s[0-9]{4})$/,
		identification: /^(4026|417500|4405|4508|4844|4913|4917)/,
		spaceIndexes: [4, 8, 12],
		length: [16, 19, 19],
		icon: "generic",
	},
	interpayment: {
		verification: /^(636)[0-9]\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^(636)/,
		length: [16, 19, 19],
		icon: "generic",
	},
	jcb: {
		verification: /^((?:2131|1800)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|(35[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})$/,
		identification: /^(?:2131|1800|35\d{3})/,
		spaceIndexes: [4, 8, 12],
		length: [16, 19, 19],
		icon: "generic",
	},
	unionpay: {
		verification: /^(62|88)[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^(62|88)/,
		length: [16, 19, 19],
		icon: "generic",
	},
	maestro: {
		verification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/,
		length: [16, 19, 19],
		icon: "maestro",
	},
	mastercard: {
		verification: /^5[1-5][0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		spaceIndexes: [4, 8, 12],
		identification: /^5[1-5][0-9]/,
		length: [16, 19, 19],
		icon: "mastercard",
	},
	visa: {
		verification: /^4[0-9]{3}\s[0-9]{4}\s[0-9]{4}\s[0-9](?:[0-9]{3})?$/,
		spaceIndexes: [4, 8, 12],
		identification: /^4[0-9]/,
		length: [16, 16, 19],
		icon: "visa",
	},
}
