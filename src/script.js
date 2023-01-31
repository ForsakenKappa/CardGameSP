import { Card } from "./cards"

// Global Parameters
window.localStorage.setItem("currentScreen", "difficulty")
window.localStorage.setItem("difficultySelected", "3")
window.localStorage.setItem("timeSpent", "")
window.localStorage.setItem("cards", "")

//Constants

//Varaibales
let currentScreen
let currentScreenDOM
let isCardShown
let pair = []

/*
    План:
    
    1. Использовать ЛокалСтораге для возможности сохранения при выходе
    2. Придумать как запихнуть карты в строки (Я планировал массив, как его в строки запихнуть я не знаю)
                                               (Хотя строка это массив символов, хмм...)
    3. Переделать генерацию карт
    
*/

function handleStateChange() {
    currentScreenDOM.classList.toggle("hidden")
    currentScreen = window.localStorage.getItem("currentScreen")
    currentScreenDOM = document.querySelector(`.${currentScreen}`)
    currentScreenDOM.classList.toggle("hidden")

    if (window.localStorage.getItem("currentScreen") === "game") {
        isCardShown = false
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

    gameDiv.removeEventListener("click", handleScreenClick)
    gameDiv.addEventListener("click", handleScreenClick)

    let difficultySelected = window.localStorage.getItem("difficultySelected")
    let cardAmount = 0
    let cardsToDuplicate = []
    if (difficultySelected === "1") {
        cardAmount = 6
    } else if (difficultySelected === "2") {
        cardAmount = 12
    } else if (difficultySelected === "3") {
        cardAmount = 18
    }

    // Making grid more "square"
    let rectangleSides = calculateRectangleSides(cardAmount)
    gameDiv.style.gridTemplateColumns = `repeat(${rectangleSides[1]}, 1fr)`
    gameDiv.style.gridTemplateRows = `repeat(${rectangleSides[0]}, 1fr)`

    //Adding cards
    for (let i = 0; i < cardAmount / 2; i++) {
        let card = new Card(null, null, isCardShown)
        cardsToDuplicate.push({
            suit: card.suit,
            rank: card.rank,
        })
        gameDiv.appendChild(card.card)
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
        gameDiv.appendChild(card.card)
    }

    //Flashing cards
    if (!isCardShown) {
        let cards = document.querySelectorAll(".card")
        cards.forEach((card) => {
            setTimeout(animateCard, 5000, card)
        })
    }
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
            //Pass
        } else {
            setTimeout(animateCard, 1000, pair[0])
            setTimeout(animateCard, 1000, pair[1])
        }
        pair = []
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
