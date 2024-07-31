export interface Settings {
	readonly type:
		| "button"
		| "checkbox"
		| "color"
		| "date"
		| "datetime-local"
		| "email"
		| "file"
		| "hidden"
		| "image"
		| "month"
		| "number"
		| "password"
		| "radio"
		| "range"
		| "reset"
		| "search"
		| "submit"
		| "tel"
		| "text"
		| "time"
		| "url"
		| "week"
	readonly autocomplete?:
		| "off"
		| "on"
		| "name"
		| "honorific-prefix"
		| "given-name"
		| "additional-name"
		| "family-name"
		| "honorific-suffix"
		| "nickname"
		| "email"
		| "username"
		| "new-password"
		| "current-password"
		| "organization-title"
		| "organization"
		| "street-address"
		| "address-line1"
		| "address-line2"
		| "address-line3"
		| "address-level4"
		| "address-level3"
		| "address-level2"
		| "address-level1"
		| "country"
		| "country-name"
		| "postal-code"
		| "cc-name"
		| "cc-given-name"
		| "cc-additional-name"
		| "cc-family-name"
		| "cc-number"
		| "cc-exp"
		| "cc-exp-month"
		| "cc-exp-year"
		| "cc-csc"
		| "cc-type"
		| "transaction-amount"
		| "language"
		| "bday"
		| "bday-day"
		| "bday-month"
		| "bday-year"
		| "sex"
		| "tel"
		| "tel-country-code"
		| "tel-national"
		| "tel-area-code"
		| "tel-local"
		| "tel-extension"
		| "impp"
		| "url"
		| "photo"
	readonly inputmode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
	readonly length?: [number | undefined, number | undefined]
	readonly pattern?: RegExp
	readonly classes?: string[]
}
