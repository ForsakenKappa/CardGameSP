// Global Parameters
window.localStorage.setItem("currentScreen", "difficulty")
window.localStorage.setItem("difficultySelected", "")
window.localStorage.setItem("timeSpent", "")
window.localStorage.setItem("cards", "")

let currentScreen
let currentScreenDOM
let isCardShown

/*
    План:
    
    1. Использовать ЛокалСтораге для возможности сохранения при выходе
    2. Как-нибудь разделить код, чтобы у меня не было каши из 500 строк
    3. Игра будет SPA
        3.1 Скрытие\показывание страниц
    4. Придумать как запихнуть карты в строки (Я планировал массив, как его в строки запихнуть я не знаю)
                                               (Хотя строка это массив символов, хмм...)
    
*/

function handleStateChange() {
    currentScreenDOM.classList.toggle("hidden")
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)
    currentScreenDOM.classList.toggle("hidden")

    if (window.localStorage.getItem("currentScreen") === "game") {
        renderGameScreen()
    }
    if (window.localStorage.getItem("currentScreen") === "difficulty") {
        // Pass
    }
}

function handleDifficultySelectButton() {
    window.localStorage.setItem("difficultySelected", this.dataset.difficulty)
    window.localStorage.setItem("currentScreen", "game")
    handleStateChange()
}

function renderGameScreen() {
    let gameDiv = document.querySelector(".game__main")
    gameDiv.textContent = ""

    //    Debug layout    //
    // Tiles
    gameDiv.appendChild(createCard("tile", "A", isCardShown))
    gameDiv.appendChild(createCard("tile", "J", isCardShown))
    gameDiv.appendChild(createCard("tile", "K", isCardShown))
    gameDiv.appendChild(createCard("tile", "Q", isCardShown))
    gameDiv.appendChild(createCard("tile", "10", isCardShown))
    gameDiv.appendChild(createCard("tile", "9", isCardShown))
    gameDiv.appendChild(createCard("tile", "8", isCardShown))
    gameDiv.appendChild(createCard("tile", "7", isCardShown))
    gameDiv.appendChild(createCard("tile", "6", isCardShown))

    // Pikes
    gameDiv.appendChild(createCard("pike", "A", isCardShown))
    gameDiv.appendChild(createCard("pike", "J", isCardShown))
    gameDiv.appendChild(createCard("pike", "K", isCardShown))
    gameDiv.appendChild(createCard("pike", "Q", isCardShown))
    gameDiv.appendChild(createCard("pike", "10", isCardShown))
    gameDiv.appendChild(createCard("pike", "9", isCardShown))
    gameDiv.appendChild(createCard("pike", "8", isCardShown))
    gameDiv.appendChild(createCard("pike", "7", isCardShown))
    gameDiv.appendChild(createCard("pike", "6", isCardShown))

    // Hearts
    gameDiv.appendChild(createCard("heart", "A", isCardShown))
    gameDiv.appendChild(createCard("heart", "J", isCardShown))
    gameDiv.appendChild(createCard("heart", "K", isCardShown))
    gameDiv.appendChild(createCard("heart", "Q", isCardShown))
    gameDiv.appendChild(createCard("heart", "10", isCardShown))
    gameDiv.appendChild(createCard("heart", "9", isCardShown))
    gameDiv.appendChild(createCard("heart", "8", isCardShown))
    gameDiv.appendChild(createCard("heart", "7", isCardShown))
    gameDiv.appendChild(createCard("heart", "6", isCardShown))

    // Clovers
    gameDiv.appendChild(createCard("clover", "A", isCardShown))
    gameDiv.appendChild(createCard("clover", "J", isCardShown))
    gameDiv.appendChild(createCard("clover", "K", isCardShown))
    gameDiv.appendChild(createCard("clover", "Q", isCardShown))
    gameDiv.appendChild(createCard("clover", "10", isCardShown))
    gameDiv.appendChild(createCard("clover", "9", isCardShown))
    gameDiv.appendChild(createCard("clover", "8", isCardShown))
    gameDiv.appendChild(createCard("clover", "7", isCardShown))
    gameDiv.appendChild(createCard("clover", "6", isCardShown))
}

function createCard(suit, rank, isDisclosed = true) {
    let cardFragment = document.createDocumentFragment()

    //Create div.card & append it to fragment
    let cardDiv = document.createElement("div")
    cardDiv.classList.add("card")
    if (isDisclosed) {
        cardDiv.classList.add("card_disclosed")
    }
    cardDiv.dataset.suit = suit
    cardDiv.dataset.rank = rank
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
    rankUpperText.textContent = rank
    rankLowerText.textContent = rank
    cardRank.appendChild(rankUpperText)
    cardRank.appendChild(rankLowerText)

    return cardFragment
}

window.addEventListener("DOMContentLoaded", () => {
    // TODO:
    // Избавиться от этого EventListener'a

    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)

    const screenButtons = document.querySelectorAll(".footer__screen-button")
    screenButtons.forEach((button) => {
        button.addEventListener("click", () => {
            let buttonId = button.id
            switch (buttonId) {
                case "1":
                    window.localStorage.setItem("currentScreen", "difficulty")
                    break
                case "2":
                    window.localStorage.setItem("currentScreen", "game")
                    isCardShown = false
                    break
                case "3":
                    window.localStorage.setItem("currentScreen", "game")
                    isCardShown = true
                    break
            }
            handleStateChange()
        })
    })

    const difficultyButtons = document.querySelectorAll(".difficulty__button")
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", handleDifficultySelectButton)
    })
})
