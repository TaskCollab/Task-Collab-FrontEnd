describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.clearLocalStorage();
  });

  it('should display validation errors for empty form submission', () => {
    cy.get('form').submit();
    cy.get('.MuiAlert-message').should('contain', 'Please fill in all fields'); // Updated selector
  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest');

    cy.get('#username').type('invalid@user.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click(); // Updated selector
    cy.wait('@loginRequest');
    cy.get('.MuiAlert-message').should('contain', 'Invalid credentials'); // Updated selector
  });

  it('should successfully login with valid credentials and redirect to /home', () => {
    const mockToken = 'fake-jwt-token';
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { token: mockToken },
    }).as('loginRequest');

    cy.get('#username').type('valid@user.com');
    cy.get('#password').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        username: 'valid@user.com',
        password: 'correctpassword',
      });
    });

    cy.get('.MuiAlert-message').should('contain', 'Login successful!'); // Updated selector
    cy.window().its('localStorage.authToken').should('eq', mockToken);
    cy.url().should('include', '/home'); // Check for redirection
  });

  it('should navigate to forgot password page', () => {
    cy.get('a[href="/forgot-password"]')
      .should('have.attr', 'href', '/forgot-password')
      .click();
    cy.url().should('include', '/forgot-password'); //checking that the url changed
  });

  it('should handle network errors', () => {
    cy.intercept('POST', '**/login', {
      forceNetworkError: true,
    }).as('networkError');

    cy.get('#username').type('test@user.com');
    cy.get('#password').type('password');
    cy.get('button[type="submit"]').click();

    cy.wait('@networkError');
    cy.get('.MuiAlert-message').should('contain', 'An error occurred during login'); // Updated selector
  });
});