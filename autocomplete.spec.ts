import { tidily } from "./index"

describe("Handler", () => {
	const stateEditor = tidily.StateEditor.create()
	const formatter = tidily.get("email")?.format(stateEditor)
	const type = formatter?.autocomplete
	it(`autocomplete type`, () => expect(type).toEqual("email"))
})
