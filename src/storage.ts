import { Card } from "./card"

export class Storage {
    difficulty: string
    cardsString: string
    cards: Array<Card>

    constructor() {
        this.difficulty =
            window.localStorage.getItem("difficultySelected") || "3"
        this.cardsString = window.localStorage.getItem("cards") || ""
        this.cards = []
    }

    addCard(card: Card) {
        this.cards.push(card)
    }

    clearCards() {
        window.localStorage.setItem("cards", "")
        this.cardsString = ""
        this.cards.length = 0
    }

    storeCards() {
        if (this.cards.length > 0) {
            this.cards.forEach((card) => {
                this.cardsString += card.suit[0]
                this.cardsString += card.rank === "10" ? "X" : card.rank
                this.cardsString += Number(card.isDisclosed) + " "
            })
            this.cardsString = this.cardsString.trimEnd()
        }
        window.localStorage.setItem("cards", this.cardsString)
    }

    retriveCards() {
        this.cardsString = window.localStorage.getItem("cards") as string
        if (this.cardsString) {
            const regExp = /\b[hptc]([6-9]|[QKJAX])[0-1]\b/g
            const regExpMatches = this.cardsString.match(regExp)

            if (!regExpMatches) {
                throw new Error("No string cards found")
            }

            for (let i = 0; i < regExpMatches.length; i++) {
                const element = regExpMatches[i]
                const rank = element[1] === "X" ? "10" : element[1]
                const isDisclosed = Boolean(Number(element[2]))

                let suit = "x"

                switch (element[0]) {
                    case "h":
                        suit = "heart"
                        break
                    case "p":
                        suit = "pike"
                        break
                    case "t":
                        suit = "tile"
                        break
                    case "c":
                        suit = "clover"
                        break
                    default:
                        throw new Error("No suit is found; aborting")
                }

                this.addCard(new Card(suit, rank, isDisclosed))
            }
        }
    }
}
