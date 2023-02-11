const { it, expect, describe } = require("@jest/globals")
const { Card } = require("./src/card")

describe("Card Class", () => {
    it("should generate a card when input is given", () => {
        const card = new Card("suit", "rank", true)

        expect(card).toEqual({
            suit: "suit",
            rank: "rank",
            isDisclosed: true,
        })
    })

    it("should generate a card when no suit is given", () => {
        const card = new Card(undefined, "rank", true)

        expect(card.suit).toBeTruthy()
    })

    it("should generate a card when no rank is given", () => {
        const card = new Card("suit", undefined, true)

        expect(card.rank).toBeTruthy()
    })
})
