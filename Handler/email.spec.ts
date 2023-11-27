import { format } from "./index"

describe("email", () => {
	it("format", () => {
		expect(format("hello@world.com", "email", { pattern: /.*@.*/ })).toEqual("hello@world.com")
	})
})
