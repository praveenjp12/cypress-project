describe('template spec', () => {
  it('passes', () => {
    const data= {Browser:Cypress.browser.name,
      Test_Tags:Cypress.env('TEST_TAGS'),
      Test_Stage:Cypress.env('TEST_STAGE')}
      cy.allure().writeEnvironmentInfo(data).parameter('initial', JSON.strongify(data, null, 2))
    cy.visit('https://example.cypress.io')
  })
})