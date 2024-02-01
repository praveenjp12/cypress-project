describe('template spec', () => {
  it('passes', () => {
    const data= {Browser:Cypress.browser.name,
      Test_Tags:Cypress.env('TEST_TAGS'),
      Test_Stage:Cypress.env('TEST_STAGE')}
      cy.allure().writeEnvironmentInfo(data).parameter('initial', JSON.stringify(data, null, 2))
    cy.visit('https://example.cypress.io')
  })
})