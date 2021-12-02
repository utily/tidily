import { Action } from "../../Action"
import { Formatter } from "../../Formatter"
import { get } from "../index"

describe("date english", () => {
	const handler = get("date", "dd/MM/YYYY") as Formatter
	it("date key event year last digit + auto dash", () => {
		const result = Action.apply(handler, { value: "", selection: { start: 0, end: 0 } }, { key: "0" })
		expect(result).toMatchObject({ value: "0", selection: { start: 1, end: 1 } })
	})
	it("date key event year last digit + auto dash", () => {
		const result = Action.apply(handler, { value: "3", selection: { start: 1, end: 1 } }, { key: "1" })
		expect(result).toMatchObject({ value: "31", selection: { start: 2, end: 2 } })
	})
	it("date key event month trigger format", () => {
		const result = Action.apply(handler, { value: "31", selection: { start: 2, end: 2 } }, { key: "/" })
		expect(result).toMatchObject({ value: "31/", selection: { start: 3, end: 3 } })
	})
	it("date key event month last digit trigger format", () => {
		const result = Action.apply(handler, { value: "31/", selection: { start: 3, end: 3 } }, { key: "0" })
		expect(result).toMatchObject({ value: "31/0", selection: { start: 4, end: 4 } })
	})
	it("date key event month last digit trigger format", () => {
		const result = Action.apply(handler, { value: "30/1", selection: { start: 4, end: 4 } }, { key: "2" })
		expect(result).toMatchObject({ value: "30/12", selection: { start: 5, end: 5 } })
	})
	it("date key event 29 february (leap year) last digit trigger format", () => {
		const result = Action.apply(handler, { value: "31/10", selection: { start: 5, end: 5 } }, { key: "/" })
		expect(result).toMatchObject({ value: "31/10/", selection: { start: 6, end: 6 } })
	})
	it("date key event 29 february last digit trigger format", () => {
		const result = Action.apply(handler, { value: "30/10/202", selection: { start: 9, end: 9 } }, { key: "1" })
		expect(result).toMatchObject({ value: "30/10/2021", selection: { start: 10, end: 10 } })
	})

	it("date test end of months", () => {
		expect(Action.apply(handler, { value: "31/01/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/01/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/02/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "28/02/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/03/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/03/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/04/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "30/04/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/05/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/05/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "35/06/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "30/06/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/07/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/07/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/08/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/08/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/09/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "30/09/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/10/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/10/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/11/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "30/11/2021",
			selection: { start: 10, end: 10 },
		})
		expect(Action.apply(handler, { value: "31/12/202", selection: { start: 9, end: 9 } }, { key: "1" })).toMatchObject({
			value: "31/12/2021",
			selection: { start: 10, end: 10 },
		})
	})
})
