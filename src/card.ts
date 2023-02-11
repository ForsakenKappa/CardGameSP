export class Card {
    suit?: string
    rank?: string
    isDisclosed: boolean

    constructor(suit?: string, rank?: string, isDisclosed = true) {
        this.suit = suit ? suit : this.getRandomSuit()
        this.rank = rank ? rank : this.getRandomRank()
        this.isDisclosed = isDisclosed
    }

    get card() {
        return this.createCard()
    }

    getRandomSuit(): string {
        const suits = ["heart", "clover", "tile", "pike"]
        const suit = suits[Math.floor(Math.random() * 10) % suits.length]
        return suit
    }

    getRandomRank(): string {
        const ranks = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"]
        const rank = ranks[Math.floor(Math.random() * 10) % ranks.length]
        return rank
    }

    createCard() {
        const cardFragment = document.createDocumentFragment()

        //Create div.card & append it to fragment
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        if (this.isDisclosed) {
            cardDiv.classList.add("card_disclosed")
        }
        cardDiv.dataset.suit = this.suit
        cardDiv.dataset.rank = this.rank
        cardFragment.appendChild(cardDiv)

        //Create div.suit & append it to div.card
        const suitDiv = document.createElement("div")
        suitDiv.classList.add("suit")
        cardDiv.appendChild(suitDiv)

        //Create div.suit's children and append them to div.suit
        const suitUpperLeft = document.createElement("div")
        const suitCenter = document.createElement("div")
        const suitLowerRight = document.createElement("div")
        suitUpperLeft.classList.add("suit__upper-left")
        suitCenter.classList.add("suit__center")
        suitLowerRight.classList.add("suit__lower-right")
        suitDiv.appendChild(suitUpperLeft)
        suitDiv.appendChild(suitCenter)
        suitDiv.appendChild(suitLowerRight)

        //Create div.rank & append it to div.card
        const cardRank = document.createElement("div")
        cardRank.classList.add("rank")
        cardDiv.appendChild(cardRank)

        //Create div.rank's children, populate them, & append to div.rank
        const rankUpperText = document.createElement("p")
        const rankLowerText = document.createElement("p")
        rankUpperText.classList.add("rank__text", "rank__text_upper-text")
        rankLowerText.classList.add("rank__text", "rank__text_lower-text")
        rankUpperText.textContent = this.rank as string
        rankLowerText.textContent = this.rank as string
        cardRank.appendChild(rankUpperText)
        cardRank.appendChild(rankLowerText)

        return cardFragment
    }
}
