describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login'); 
  });
  it('should display login form elements', () => {
    // Verify main elements exist
    cy.get('h1').should('contain', 'Login');
    cy.get('#username').should('exist');
    cy.get('#password').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Login');
    cy.contains('Forgot password?').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Try submitting empty form
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.get('.MuiAlert-root')
      .should('be.visible')
      .and('contain', 'Please fill in all fields');
  });

  it('should accept text input', () => {
    // Test username field
    cy.get('#username')
      .type('testuser')
      .should('have.value', 'testuser');
    
    // Test password field
    cy.get('#password')
      .type('testpassword')
      .should('have.value', 'testpassword');
  });
});