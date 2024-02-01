describe('template spec', () => {
  it('passesss', () => {
    cy.allure().writeEnvironmentInfo('Browser',Cypress.browser.name)
    cy.allure().writeEnvironmentInfo('Test Tags',Cypress.env('TEST_TAGS'))
    cy.allure().writeEnvironmentInfo('Tet Stage',Cypress.env('TEST_STAGE'))
    cy.visit('www.google.com')
    cy.get('.csssss').should('be.visible')
  })
})