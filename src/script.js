// Global Parameters
window.localStorage.setItem("gameStage", "difficultySelect")
window.localStorage.setItem("difficultySelected", "")
window.localStorage.setItem("timeSpent", "")
window.localStorage.setItem("cards", "")
window.localStorage.setItem("selectedCards", "")

/*
    План:
    
    1. Использовать ЛокалСтораге для возможности сохранения при выходе
    2. Как-нибудь разделить код, чтобы у меня не было каши из 500 строк
    3. Игра будет SPA
    4. Придумать как запихнуть карты в строки (Я планировал массив, как его в строки запихнуть я не знаю)
                                               (Хотя строка это массив символов, хмм...)
    
*/

function handleStateChange() {
    if (window.localStorage.getItem("gameStage") === "game") {
        renderGameScreen() // currently does nothing
    }
}

function handleDifficultySelectButton() {
    window.localStorage.setItem("difficultySelected", this.dataset.difficulty)
    window.localStorage.setItem("gameStage", "game")
    handleStateChange()
}

function renderGameScreen() {
    console.log(window.localStorage.getItem("gameStage"))
    console.log(window.localStorage.getItem("difficultySelected"))
    console.log("Dorime")
}

window.addEventListener("DOMContentLoaded", () => {
    const difficultyButtons = document.querySelectorAll(".difficulty__button")
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", handleDifficultySelectButton)
    })
})
