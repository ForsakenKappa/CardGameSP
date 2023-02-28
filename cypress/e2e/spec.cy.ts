describe("selecting difficulty", () => {
    beforeEach(() => {
        cy.visit("http://localhost:8080")
    })
    it("should generate 6 cards on difficulty 1", () => {
        cy.get("#difficultyChoice1").next().click()
        cy.get(".difficulty__submit").click()
        cy.get(".game__main").children().should("have.length", "6")
    })

    it("should generate 12 cards on difficulty 2", () => {
        cy.get("#difficultyChoice2").next().click()
        cy.get(".difficulty__submit").click()
        cy.get(".game__main").children().should("have.length", "12")
    })

    it("should generate 18 cards on difficulty 3", () => {
        cy.get("#difficultyChoice3").next().click()
        cy.get(".difficulty__submit").click()
        cy.get(".game__main").children().should("have.length", "18")
    })
})
