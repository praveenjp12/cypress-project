describe('template spec', () => {
  it('passes', () => {
    cy.allure().writeEnvironmentInfo().parameter(
      'Browser', Cypress.browser.name
  )
  
  cy.allure().writeEnvironmentInfo().parameter(
      'Test-Tags', Cypress.env('TEST_TAGS')
  )
  
  cy.allure().writeEnvironmentInfo().parameter(
      'Environment', Cypress.env('TEST_STAGE')
  )
    cy.visit('https://example.cypress.io')
  })
})