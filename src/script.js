import { Card } from "./card"

// Global Parameters
window.localStorage.setItem("currentScreen", "difficulty")
window.localStorage.setItem("difficultySelected", "3")
window.localStorage.setItem("timeSpent", "")
window.localStorage.setItem("cards", "")

const restartButtons = document.querySelectorAll(".game__restart")
const screenButtons = document.querySelectorAll(".footer__screen-button")
const gameScreen = document.querySelector(".game__main")
const difficultyButtons = document.querySelectorAll(".difficulty__button")
const secondsText = document.querySelectorAll(".header__sec")
const minutesText = document.querySelectorAll(".header__min")
const resultIcon = document.querySelector(".game__results-icon")
const resultText = document.querySelector(".game__results-header")

const INTRO_DELAY = 4000

let currentScreen
let currentScreenDOM
let isCardShown
let pair = []
let openCardAmount
let cardAmount
let isGameWon
let timerCount = 0
let timerID

/*
    План:
    
    1. Использовать ЛокалСтораге для возможности сохранения при выходе
    2. Придумать как запихнуть карты в строки (Я планировал массив, как его в строки запихнуть я не знаю)
                                               (Хотя строка это массив символов, хмм...)
    
*/

function handleStateChange() {
    clearInterval(timerID)
    let isOverlay = false

    // Before currentScreen change
    if (window.localStorage.getItem("currentScreen") === "game") {
        secondsText.forEach((text) => (text.textContent = "00"))
        minutesText.forEach((text) => (text.textContent = "00"))
        timerCount = 0
        openCardAmount = 0
        isCardShown = false
        initGameScreen()
    }

    if (window.localStorage.getItem("currentScreen") === "difficulty") {
        gameScreen.textContent = ""
        if (currentScreenDOM.className.includes("overlay"))
            document.querySelector(".game").classList.toggle("hidden")
    }

    if (
        window.localStorage.getItem("currentScreen") === "game__results" &&
        currentScreenDOM.className.includes("game")
    ) {
        isOverlay = true
    }

    // currentScreen changing
    if (!isOverlay) currentScreenDOM.classList.toggle("hidden")
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)
    currentScreenDOM.classList.toggle("hidden")

    //After current screen changed

    resultIcon.style.backgroundImage = isGameWon
        ? "url(./static/img/win-icon.png)"
        : "url(./static/img/lose-icon.png)"

    resultText.textContent = isGameWon ? "Вы победили!" : "Вы проиграли!"
}

function handleDifficultySelectButton() {
    window.localStorage.setItem("difficultySelected", this.dataset.difficulty)
    window.localStorage.setItem("currentScreen", "game")
    handleStateChange()
}

function initGameScreen() {
    gameScreen.removeEventListener("click", handleScreenClick)
    gameScreen.addEventListener("click", handleScreenClick)

    let difficultySelected = window.localStorage.getItem("difficultySelected")
    let cardsToDuplicate = []

    switch (difficultySelected) {
        case "1":
            cardAmount = 6
            break
        case "2":
            cardAmount = 12
            break
        case "3":
            cardAmount = 18
            break
        default:
            break
    }

    // Making grid more "square"
    let [rectangleHeight, rectangleWidth] = calculateRectangleSides(cardAmount)
    gameScreen.style.gridTemplateColumns = `repeat(${rectangleWidth}, 95px)`
    gameScreen.style.gridTemplateRows = `repeat(${rectangleHeight}, 133px)`

    //Adding cards
    for (let i = 0; i < cardAmount / 2; i++) {
        let card = new Card(null, null, isCardShown)
        cardsToDuplicate.push({
            suit: card.suit,
            rank: card.rank,
        })
        gameScreen.appendChild(card.card)
    }

    //Shuffle dupplicates
    cardsToDuplicate = cardsToDuplicate
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    //Adding duplicates
    for (let i = 0; i < cardAmount / 2; i++) {
        let cardParameters = cardsToDuplicate.pop()
        let card = new Card(
            cardParameters.suit,
            cardParameters.rank,
            isCardShown
        )
        gameScreen.appendChild(card.card)
    }

    //Flashing cards
    if (!isCardShown) {
        let cards = document.querySelectorAll(".card")
        cards.forEach((card) => {
            setTimeout(animateCard, INTRO_DELAY, card)
        })
    }

    //Go-go power timers
    setTimeout(() => {
        timerID = setInterval(updateTimer, 1000)
    }, INTRO_DELAY)
}

function handleScreenClick(e) {
    // Searching for div.card
    let currentElement = e.target
    for (let i = 0; i < 5; i++) {
        console.log(currentElement.className.includes("card"))
        if (currentElement.className.includes("card")) break
        currentElement = currentElement.parentElement
    }

    if (!currentElement.className.includes("card")) {
        console.log("Couldn't find a card")
        return
    }

    // Clicked on a card hell yea
    if (!currentElement.className.includes("card_disclosed")) {
        return
    }

    animateCard(currentElement)
    pair.push(currentElement)

    if (pair.length === 2) {
        if (
            pair[0].dataset.suit === pair[1].dataset.suit &&
            pair[0].dataset.rank === pair[1].dataset.rank
        ) {
            openCardAmount += 2
            if (openCardAmount === cardAmount) {
                window.localStorage.setItem("currentScreen", "game__results")
                isGameWon = true
                handleStateChange()
            }
        } else {
            setTimeout(animateCard, 1000, pair[0])
            setTimeout(animateCard, 1000, pair[1])

            window.localStorage.setItem("currentScreen", "game__results")
            isGameWon = false
            handleStateChange()
        }
        pair.length = 0
    }
}

function calculateRectangleSides(area) {
    let sideA
    let sideB
    let distanceArr = []

    for (let i = 0; i <= area; i++) {
        if (area % i === 0) {
            let num2 = area / i
            let distance = Math.abs(num2 - i)
            distanceArr.push(distance)
        }
    }

    distanceArr.sort((a, b) => b - a)

    let largestDistance = distanceArr.shift()
    let smallestDistnace = distanceArr.pop()

    for (let i = 0; i < largestDistance; i++) {
        if (area % i === 0 && area / i - i === smallestDistnace) {
            sideA = i
            sideB = area / i
            break
        }
    }

    return [sideA, sideB]
}

function animateCard(cardElement) {
    cardElement.classList.toggle("card_disclosed")
    cardElement.animate(
        [{ transform: "rotateY(90deg)" }, { transform: "rotateY(0deg)" }],
        {
            iterations: 1,
            duration: 200,
        }
    )
}

function updateTimer() {
    timerCount++
    let seconds = timerCount % 60
    let minutes = Math.floor(timerCount / 60)

    secondsText.forEach((text) => {
        text.textContent = seconds < 10 ? `0${seconds}` : seconds
    })

    minutesText.forEach((text) => {
        text.textContent = minutes < 10 ? `0${minutes}` : minutes
    })
}

function main() {
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)

    restartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.localStorage.setItem("currentScreen", "difficulty")
            handleStateChange()
        })
    })

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

    difficultyButtons.forEach((button) => {
        button.addEventListener("click", handleDifficultySelectButton)
    })
}

main()
