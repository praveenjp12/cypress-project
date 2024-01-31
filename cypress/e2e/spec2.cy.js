describe('template spec', () => {
  it('passesss', () => {
    cy.visit('google.com')
    cy.get('.csssss').should('be.visible')
  })
})