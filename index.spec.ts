import { tidily } from "./index"

describe("Handler", () => {
	const data: [string, tidily.Type, string, ...string[]][] = [
		["987", "card-csc", "987"],
		["9/22", "card-expires", "09 / 22"],
		["4111111111111111", "card-number", "4111 1111 1111 1111"],
		["test@example.com", "email", "test@example.com"],
		["password", "password", "password"],
		["42", "percent", "42 %"],
		["0101881108", "phone", "+46-10-188 11 08", "SE"],
		["13.37", "price", "13.37 SEK", "SEK"],
		["normal text", "text", "normal text"],
	]
	for (const [value, type, expected, ...argument] of data)
		it(`format ${type}`, () => expect(tidily.format(value, type, ...argument)).toEqual(expected))
})
