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

let currentScreen : string
let currentScreenDOM : HTMLElement
let isCardShown : boolean
let pair : Array<HTMLElement> = []
let openCardAmount : number
let cardAmount : number
let isGameWon : boolean
let timerCount = 0
let timerID : NodeJS.Timer

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
        if (gameScreen) gameScreen.textContent = ""
        if (currentScreenDOM.className.includes("overlay"))
            document.querySelector(".game")?.classList.toggle("hidden")
    }

    if (
        window.localStorage.getItem("currentScreen") === "game__results" &&
        currentScreenDOM.className.includes("game")
    ) {
        isOverlay = true
    }

    // currentScreen changing
    if (!isOverlay) currentScreenDOM.classList.toggle("hidden")
    currentScreen = window.localStorage.getItem("currentScreen")!
    currentScreenDOM = document.querySelector(`.${currentScreen}`)!
    currentScreenDOM.classList.toggle("hidden")


    //After current screen changed
    if (resultIcon && resultText) {
        (<HTMLElement>resultIcon).style.backgroundImage = isGameWon
            ? "url(./static/img/win-icon.png)"
            : "url(./static/img/lose-icon.png)"

        resultText.textContent = isGameWon ? "Вы победили!" : "Вы проиграли!"
    }
}

function handleDifficultySelectButton(this: any) {
    window.localStorage.setItem("difficultySelected", this.dataset.difficulty)
    window.localStorage.setItem("currentScreen", "game")
    handleStateChange()
}

function initGameScreen() {
    gameScreen!.removeEventListener("click", handleScreenClick)
    gameScreen!.addEventListener("click", handleScreenClick)

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
    let rectangleHeight : number 
    let rectangleWidth : number 
    [rectangleHeight, rectangleWidth] = calculateRectangleSides(cardAmount) as number[]
    (<HTMLElement>gameScreen).style.gridTemplateColumns = `repeat(${rectangleWidth}, 95px)` as string // I have no idea what's that
    (<HTMLElement>gameScreen).style.gridTemplateRows = `repeat(${rectangleHeight}, 133px)`

    //Adding cards
    for (let i = 0; i < cardAmount / 2; i++) {
        let card = new Card(undefined, undefined, isCardShown)
        cardsToDuplicate.push({
            suit: card.suit,
            rank: card.rank,
        })
        gameScreen!.appendChild(card.card)
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
            cardParameters!.suit,
            cardParameters!.rank,
            isCardShown
        )
        gameScreen!.appendChild(card.card)
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

function handleScreenClick(e : Event) {
    // Searching for div.card
    let currentElement = e.target as HTMLElement
    let className = currentElement.className
    for (let i = 0; i < 5; i++) {
        console.log(className.includes("card"))
        if (className.includes("card")) break
        currentElement = currentElement.parentElement !
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

function calculateRectangleSides(area : number) : Array<number> {
    let sideA : number = 0
    let sideB : number = 0
    let largestDistance : number 
    let smallestDistnace : number
    let distanceArr : Array<number> = []

    for (let i = 0; i <= area; i++) {
        if (area % i === 0) {
            let num2 = area / i
            let distance = Math.abs(num2 - i)
            distanceArr.push(distance)
        }
    }

    distanceArr.sort((a, b) => b - a)

    largestDistance = distanceArr.shift() !
    smallestDistnace = distanceArr.pop()  !

    for (let i = 0; i < largestDistance; i++) {
        if (area % i === 0 && area / i - i === smallestDistnace) {
            sideA = i
            sideB = area / i
            break
        }
    }

    let sides : Array<number> = [sideA, sideB]

    return [sideA, sideB]
}

function animateCard(cardElement : HTMLElement) : void {
    cardElement.classList.toggle("card_disclosed")
    cardElement.animate(
        [{ transform: "rotateY(90deg)" }, { transform: "rotateY(0deg)" }],
        {
            iterations: 1,
            duration: 200,
        }
    )
}

function updateTimer() : void{
    timerCount++
    let seconds = timerCount % 60
    let minutes = Math.floor(timerCount / 60)

    secondsText.forEach((text) => {
        text.textContent = seconds < 10 ? `0${seconds}` : String(seconds)
    })

    minutesText.forEach((text) => {
        text.textContent = minutes < 10 ? `0${minutes}` : String(minutes) 
    })
}

function main() {
    currentScreen = window.localStorage.getItem("currentScreen")!
    currentScreenDOM = document.querySelector(`.${currentScreen}`)!

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
