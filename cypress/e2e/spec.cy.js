describe('template spec', () => {
  it('passes', () => {
    cy.allure().writeEnvironmentInfo('Browser',Cypress.browser.name)
    cy.allure().writeEnvironmentInfo('Test Tags',Cypress.env('TEST_TAGS'))
    cy.allure().writeEnvironmentInfo('Tet Stage',Cypress.env('TEST_STAGE'))
    cy.visit('https://example.cypress.io')
  })
})