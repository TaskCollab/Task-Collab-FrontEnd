describe('ViewTasks Page - UI Only Tests', () => {
  beforeEach(() => {
    cy.visit('/tasks');
  });

  it('should open and close the create task dialog', () => {
    // Attempt to close the toast if it exists
    cy.get('.Toastify__close-button').then(($closeButton) => {
      if ($closeButton.length) {
        cy.wrap($closeButton).click(); // Click the close button
      }
    });

    cy.contains('New Task').click();
    cy.get('h2').should('contain', 'Create New Task');
    cy.contains('Cancel').click();
    cy.get('h2').should('not.exist');
  });

  it('should successfully open the task creation form', () => {
    window.localStorage.setItem('authToken', 'fake-token');
    cy.visit('/tasks');

    // Attempt to close the toast if it exists
    cy.get('.Toastify__close-button').then(($closeButton) => {
      if ($closeButton.length) {
        cy.wrap($closeButton).click(); // Click the close button
      }
    });

    cy.contains('button', 'New Task')
      .should('be.visible')
      .click();
    cy.get('h2')
      .should('be.visible')
      .and('contain', 'Create New Task');
  });
});