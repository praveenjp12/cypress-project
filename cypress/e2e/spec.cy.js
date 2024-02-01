describe('template spec', () => {
  it('passes', () => {
    cy.allure().writeEnvironmentInfo({'Browser':Cypress.browser.name,
    'Test Tags':Cypress.env('TEST_TAGS'),
    'Tet Stage':Cypress.env('TEST_STAGE')})
    cy.visit('https://example.cypress.io')
  })
})