import { Converter } from "../Converter"
import { Formatter } from "../Formatter"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { Settings } from "../Settings"
import { add } from "./base"

class Handler implements Converter<string>, Formatter {
	toString(data: string | any): string {
		return typeof data == "string" ? data : ""
	}
	fromString(value: string): string | undefined {
		return typeof value == "string" ? value : undefined
	}
	format(unformated: StateEditor): Readonly<State> & Settings {
		const issuer = getIssuer(unformated.value)
		const result = unformated.map(
			(symbol, index) => symbol + (index % 4 == 3 && index + 1 < issuer.length[0] ? " " : "")
		)
		return {
			...result,
			type: "text",
			autocomplete: "cc-number",
			length: issuer.length.slice(1) as [number | undefined, number | undefined],
			pattern: issuer.verification,
			classes: ["issuer-" + issuer.icon],
		}
	}
	unformat(formated: StateEditor): Readonly<State> {
		return formated.delete(" ")
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
	identification: RegExp
	length: [number, number, number] // Max unformated, min formated, max formated
	icon: string
}
function getIssuer(value: string): CardIssuer & { name: string } {
	let result: CardIssuer & { name: string } = defaultIssuer
	for (const key in issuers)
		if (Object.prototype.hasOwnProperty.call(issuers, key) && issuers[key].identification.test(value)) {
			result = { ...defaultIssuer, name: key, ...issuers[key] }
			break
		}
	return result
}
const defaultIssuer: CardIssuer = {
	name: "unknown",
	verification: /^\d{19}$/,
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
		identification: /^(5019)\d+/,
		length: [16, 19, 19],
		icon: "generic",
	},
	diners: {
		verification: /^3(?:0[0-5]|[68][0-9])[0-9]\s[0-9]{4}\s[0-9]{4}\s[0-9]{2}$/,
		identification: /^3(?:0[0-5]|[68][0-9])/,
		length: [14, 17, 17],
		icon: "diners",
	},
	discover: {
		verification: /^6(?:011|5[0-9]{2})\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		identification: /^6(?:011|5[0-9]{2})/,
		length: [16, 19, 19],
		icon: "generic",
	},
	electron: {
		verification: /^((4026|4405|4508|4844|4913|4917)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|((4175)\s(00)[0-9]{2}\s[0-9]{4}\s[0-9]{4})$/,
		identification: /^(4026|417500|4405|4508|4844|4913|4917)/,
		length: [16, 19, 19],
		icon: "generic",
	},
	interpayment: {
		verification: /^(636)[0-9]\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		identification: /^(636)/,
		length: [16, 19, 19],
		icon: "generic",
	},
	jcb: {
		verification: /^((?:2131|1800)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})|(35[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4})$/,
		identification: /^(?:2131|1800|35\d{3})/,
		length: [16, 19, 19],
		icon: "generic",
	},
	unionpay: {
		verification: /^(62|88)[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		identification: /^(62|88)/,
		length: [16, 19, 19],
		icon: "generic",
	},
	maestro: {
		verification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		identification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/,
		length: [16, 19, 19],
		icon: "maestro",
	},
	mastercard: {
		verification: /^5[1-5][0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
		identification: /^5[1-5][0-9]/,
		length: [16, 19, 19],
		icon: "mastercard",
	},
	visa: {
		verification: /^4[0-9]{3}\s[0-9]{4}\s[0-9]{4}\s[0-9](?:[0-9]{3})?$/,
		identification: /^4[0-9]/,
		length: [16, 16, 19],
		icon: "visa",
	},
}
