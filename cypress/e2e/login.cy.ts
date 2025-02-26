describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.clearLocalStorage();
  });
  it('should display validation errors for empty form submission', () => {
    cy.get('form').submit();
    cy.get('.error-message').should('contain', 'Please fill in all fields');
  });

  it('should show error for invalid credentials', () => {
    //if we have API error, show up here.
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');
    cy.get('#username').type('invalid@user.com');
    cy.get('#password').type('wrongpassword');
    cy.get('.submit-btn').click();
    cy.wait('@loginRequest');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('should successfully login with valid credentials', () => {
    //if we have API success, show up here.
    const mockToken = 'fake-jwt-token';
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { token: mockToken }
    }).as('loginRequest');

    cy.get('#username').type('valid@user.com');
    cy.get('#password').type('correctpassword');
    cy.get('.submit-btn').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        username: 'valid@user.com',
        password: 'correctpassword'
      });
    });

    cy.get('.success-message').should('contain', 'Login successful!');
    cy.window().its('localStorage.authToken').should('eq', mockToken);
  });

  it('should navigate to forgot password page', () => {
    cy.get('.forgot-password a')
      .should('have.attr', 'href', '/forgot-password')
      .click();
  });

  it('should handle network errors', () => {
    cy.intercept('POST', '**/login', {
      forceNetworkError: true
    }).as('networkError');

    cy.get('#username').type('test@user.com');
    cy.get('#password').type('password');
    cy.get('.submit-btn').click();

    cy.wait('@networkError');
    cy.get('.error-message').should('contain', 'An error occurred during login');
  });
});