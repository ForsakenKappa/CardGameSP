import { Card } from "./card"
import { Storage } from "./storage"

// Global Parameters
window.localStorage.setItem("difficultySelected", "3")

const restartButtons = document.querySelectorAll(".game__restart")
const screenButtons = document.querySelectorAll(".footer__screen-button")
const gameScreen = document.querySelector(".game__main")
const difficultyRadios = document.querySelectorAll(
    ".difficulty__radio"
) as NodeListOf<HTMLInputElement>
const difficultySubmitButton = document.querySelector(".difficulty__submit")
const secondsText = document.querySelectorAll(".header__sec")
const minutesText = document.querySelectorAll(".header__min")
const resultIcon = document.querySelector(".game__results-icon")
const resultText = document.querySelector(".game__results-header")

const INTRO_DELAY = 4000
const STORAGE = new Storage()

const pair: Array<HTMLElement> = []

let currentScreenDOM: HTMLElement
let isCardShown: boolean
let openCardAmount: number
let cardAmount: number
let isGameWon: boolean
let timerCount: number
let timerID: NodeJS.Timer
let difficultySelected: string

function handleStateChange() {
    clearInterval(timerID)
    let isOverlay = false

    // Before currentScreen change
    if (STORAGE.currentScreen === "game") {
        const minutes = STORAGE.timeSpent.slice(0, 2)
        const seconds = STORAGE.timeSpent.slice(2, 4)
        secondsText.forEach((text) => (text.textContent = seconds))
        minutesText.forEach((text) => (text.textContent = minutes))
        timerCount = Number(minutes) * 60 + Number(seconds)

        openCardAmount = 0
        isCardShown = false
        initGameScreen()
    }

    if (STORAGE.currentScreen === "difficulty") {
        if (gameScreen) gameScreen.textContent = ""
        if (currentScreenDOM.className.includes("overlay"))
            document.querySelector(".game")?.classList.toggle("hidden")
    }

    if (
        STORAGE.currentScreen === "game__results" &&
        currentScreenDOM.className.includes("game")
    ) {
        isOverlay = true
    }

    // currentScreen changing
    if (!isOverlay) currentScreenDOM.classList.toggle("hidden")
    currentScreenDOM = document.querySelector(
        `.${STORAGE.currentScreen}`
    ) as HTMLElement
    currentScreenDOM.classList.toggle("hidden")

    //After current screen changed
    if (resultIcon && resultText) {
        ;(<HTMLElement>resultIcon).style.backgroundImage = isGameWon
            ? "url(./static/img/win-icon.png)"
            : "url(./static/img/lose-icon.png)"

        resultText.textContent = isGameWon ? "Вы победили!" : "Вы проиграли!"
    }
}

function handleDifficultySubmit() {
    difficultyRadios.forEach((radio) => {
        if (radio.checked) {
            difficultySelected = radio.value
            radio.checked = false
        }
    })
    window.localStorage.setItem("currentScreen", "game")
    handleStateChange()
}

function initGameScreen() {
    if (!gameScreen) return
    gameScreen.removeEventListener("click", handleScreenClick)
    gameScreen.addEventListener("click", handleScreenClick)

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
            cardAmount = STORAGE.getCardAmount()
            break
    }

    addCardsToGameScreen()

    // Making grid more "square"
    let rectangleHeight: number
    let rectangleWidth: number
        // eslint-disable-next-line prefer-const
    ;[rectangleHeight, rectangleWidth] = calculateRectangleSides(
        cardAmount
    ) as number[]
    ;(<HTMLElement>gameScreen).style.gridTemplateColumns =
        `repeat(${rectangleWidth}, 95px)` as string // I have no idea what's that
    ;(<HTMLElement>(
        gameScreen
    )).style.gridTemplateRows = `repeat(${rectangleHeight}, 133px)`

    //Flashing cards
    if (!isCardShown) {
        const cards = document.querySelectorAll(".card")
        cards.forEach((card) => {
            setTimeout(animateCard, INTRO_DELAY, card)
        })
    }

    //Go-go power timers
    setTimeout(() => {
        timerID = setInterval(updateTimer, 1000)
    }, INTRO_DELAY)
}

function handleScreenClick(e: Event) {
    // Searching for div.card
    let currentElement = e.target as HTMLElement
    const className = currentElement.className
    for (let i = 0; i < 5; i++) {
        console.log(className.includes("card"))
        if (className.includes("card")) break
        currentElement = currentElement.parentElement as HTMLElement
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

function calculateRectangleSides(area: number): Array<number> {
    let sideA = 0
    let sideB = 0

    const distanceArr: Array<number> = []

    for (let i = 0; i <= area; i++) {
        if (area % i === 0) {
            // eslint-disable-next-line prefer-const
            let num2 = area / i
            // eslint-disable-next-line prefer-const
            let distance = Math.abs(num2 - i)
            distanceArr.push(distance)
        }
    }

    distanceArr.sort((a, b) => b - a)

    const largestDistance = distanceArr.shift() as number
    const smallestDistnace = distanceArr.pop() as number

    for (let i = 0; i < largestDistance; i++) {
        if (area % i === 0 && area / i - i === smallestDistnace) {
            sideA = i
            sideB = area / i
            break
        }
    }

    return [sideA, sideB]
}

function animateCard(cardElement: HTMLElement): void {
    cardElement.classList.toggle("card_disclosed")
    cardElement.animate(
        [{ transform: "rotateY(90deg)" }, { transform: "rotateY(0deg)" }],
        {
            iterations: 1,
            duration: 200,
        }
    )
}

function updateTimer(): void {
    timerCount++
    const seconds = timerCount % 60
    const secondsString = seconds < 10 ? `0${seconds}` : String(seconds)
    const minutes = Math.floor(timerCount / 60)
    const minutesString = minutes < 10 ? `0${minutes}` : String(minutes)
    const timeSpentString = minutesString + secondsString

    secondsText.forEach((text) => (text.textContent = secondsString))
    minutesText.forEach((text) => (text.textContent = minutesString))

    STORAGE.timeSpent = timeSpentString
}

function addCardsToGameScreen(): void {
    if (!gameScreen) return
    let cardsToDuplicate = []

    const cards = STORAGE.retriveCards()
    if (!cards) {
        //Adding cards
        for (let i = 0; i < cardAmount / 2; i++) {
            const card = new Card(undefined, undefined, isCardShown)
            cardsToDuplicate.push({
                suit: card.suit,
                rank: card.rank,
            })
            STORAGE.addCard(card)
            gameScreen.appendChild(card.card)
        }

        //Shuffle dupplicates
        cardsToDuplicate = cardsToDuplicate
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

        //Adding duplicates
        for (let i = 0; i < cardAmount / 2; i++) {
            const cardParameters = cardsToDuplicate.pop()
            if (!cardParameters) return
            const card = new Card(
                cardParameters.suit,
                cardParameters.rank,
                isCardShown
            )
            STORAGE.addCard(card)
            gameScreen.appendChild(card.card)
        }

        STORAGE.storeCards()
    } else {
        cards.forEach((card) => {
            gameScreen.appendChild(card.card)
        })
    }
}

function main() {
    currentScreenDOM = document.querySelector(
        `.${STORAGE.currentScreen}`
    ) as HTMLElement

    restartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            STORAGE.timeSpent = "0000"
            STORAGE.currentScreen = "difficulty"
            STORAGE.clearCards()
            handleStateChange()
        })
    })

    screenButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const buttonId = button.id
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

    difficultySubmitButton?.addEventListener("click", handleDifficultySubmit)

    // Difficulty is initial screen
    if (STORAGE.currentScreen !== "difficulty") {
        currentScreenDOM.classList.toggle("hidden")
        document.querySelector(".difficulty")?.classList.toggle("hidden")
        handleStateChange()
    }
}

main()
