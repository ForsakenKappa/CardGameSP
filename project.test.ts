/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from "@jest/globals"
import { Card } from "./src/card"
import { Storage } from "./src/storage"

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

describe("Storage class", () => {
    it("should add cards to storage", () => {
        const card = new Card("heart", "10", false)
        const storage = new Storage()

        storage.addCard(card)

        expect(storage.cards[0]).toBe(card)
    })

    it("should store a card into local storage", () => {
        const card = new Card("heart", "10", false)
        const storage = new Storage()
        storage.clearCards()

        storage.addCard(card)
        storage.storeCards()

        expect(window.localStorage.getItem("cards")).toBe("hX0")
    })

    it("should store multiple cards into local storage", () => {
        const card1 = new Card("heart", "10", false)
        const card2 = new Card("clover", "Q", true)
        const card3 = new Card("pike", "7", false)
        const card4 = new Card("tile", "A", true)

        const storage = new Storage()
        storage.clearCards()

        storage.addCard(card1)
        storage.addCard(card2)
        storage.addCard(card3)
        storage.addCard(card4)

        storage.storeCards()

        expect(window.localStorage.getItem("cards")).toBe("hX0 cQ1 p70 tA1")
    })

    it("should retrive a card from local storage", () => {
        const card = new Card("heart", "10", false)
        const storage = new Storage()
        storage.clearCards()

        window.localStorage.setItem("cards", "hX0")
        storage.retriveCards()

        expect(storage.cards[0]).toEqual(card)
    })

    it("should retrive multiple cards from local storage", () => {
        const card1 = new Card("heart", "10", false)
        const card2 = new Card("clover", "Q", true)
        const card3 = new Card("pike", "7", false)
        const card4 = new Card("tile", "A", true)

        const storage = new Storage()
        storage.clearCards()

        window.localStorage.setItem("cards", "hX0 cQ1 p70 tA1")
        storage.retriveCards()

        expect(storage.cards).toEqual([card1, card2, card3, card4])
    })
})
