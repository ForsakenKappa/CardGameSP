// Global Parameters
window.localStorage.setItem("currentScreen", "difficulty")
window.localStorage.setItem("difficultySelected", "")
window.localStorage.setItem("timeSpent", "")
window.localStorage.setItem("cards", "")
window.localStorage.setItem("selectedCards", "")

let currentScreen
let currentScreenDOM

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
    if (window.localStorage.getItem("currentScreen") === "game") {
        renderGameScreen()
    }
}

function handleDifficultySelectButton() {
    window.localStorage.setItem("difficultySelected", this.dataset.difficulty)
    window.localStorage.setItem("currentScreen", "game")
    handleStateChange()
}

function renderGameScreen() {
    currentScreenDOM.classList.toggle("hidden")
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)
    currentScreenDOM.classList.toggle("hidden")

    console.log(window.localStorage.getItem("currentScreen"))
    console.log(window.localStorage.getItem("difficultySelected"))
    console.log("Dorime")
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
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)

    const difficultyButtons = document.querySelectorAll(".difficulty__button")
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", handleDifficultySelectButton)
    })

    let gameDiv = document.querySelector(".game__main")

    for (let i = 0; i < 9 * 4; i++) {
        gameDiv.appendChild(createCard("heart", "A"))
    }
})
