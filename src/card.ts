export class Card {

    suit? : string
    rank? : string
    isDisclosed : boolean

    constructor(suit? : string, rank? : string, isDisclosed = true) {
        this.suit = suit ? suit : this.getRandomSuit()
        this.rank = rank ? rank : this.getRandomRank()
        this.isDisclosed = isDisclosed
    }

    get card() {
        return this.createCard()
    }

    getRandomSuit() : string {
        let suits = ["heart", "clover", "tile", "pike"]
        let suit = suits[Math.floor(Math.random() * 10) % suits.length]
        return suit
    }

    getRandomRank() : string {
        let ranks = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"]
        let rank = ranks[Math.floor(Math.random() * 10) % ranks.length]
        return rank
    }

    createCard() {
        let cardFragment = document.createDocumentFragment()

        //Create div.card & append it to fragment
        let cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        if (this.isDisclosed) {
            cardDiv.classList.add("card_disclosed")
        }
        cardDiv.dataset.suit = this.suit
        cardDiv.dataset.rank = this.rank
        cardFragment.appendChild(cardDiv)

        //Create div.suit & append it to div.card
        let suitDiv = document.createElement("div")
        suitDiv.classList.add("suit")
        cardDiv.appendChild(suitDiv)

        //Create div.suit's children and append them to div.suit
        let suitUpperLeft = document.createElement("div")
        let suitCenter = document.createElement("div")
        let suitLowerRight = document.createElement("div")
        suitUpperLeft.classList.add("suit__upper-left")
        suitCenter.classList.add("suit__center")
        suitLowerRight.classList.add("suit__lower-right")
        suitDiv.appendChild(suitUpperLeft)
        suitDiv.appendChild(suitCenter)
        suitDiv.appendChild(suitLowerRight)

        //Create div.rank & append it to div.card
        let cardRank = document.createElement("div")
        cardRank.classList.add("rank")
        cardDiv.appendChild(cardRank)

        //Create div.rank's children, populate them, & append to div.rank
        let rankUpperText = document.createElement("p")
        let rankLowerText = document.createElement("p")
        rankUpperText.classList.add("rank__text", "rank__text_upper-text")
        rankLowerText.classList.add("rank__text", "rank__text_lower-text")
        rankUpperText.textContent = this.rank!
        rankLowerText.textContent = this.rank!
        cardRank.appendChild(rankUpperText)
        cardRank.appendChild(rankLowerText)

        return cardFragment
    }
}
