describe('template spec', () => {
  it('passesss', () => {
    const data= {'Browser':Cypress.browser.name,
    'Test Tags':Cypress.env('TEST_TAGS'),
    'Tet Stage':Cypress.env('TEST_STAGE')}
    cy.allure().writeEnvironmentInfo(data).parameter('initial', JSON.strongify(data, null, 2))
    cy.visit('www.google.com')
    cy.get('.csssss').should('be.visible')
  })
})