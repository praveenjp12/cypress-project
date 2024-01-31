describe('template spec', () => {
  it('passesss', () => {
    cy.visit('www.google.com')
    cy.get('.csssss').should('be.visible')
  })
})