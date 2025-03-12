describe('Task Details E2E Tests', () => {
  beforeEach(() => {
    // Intercept API requests and mock responses (if needed)
    cy.intercept('POST', '/api/tasks/123', {
      fixture: 'taskDetails.json', // Create a fixture file
    }).as('getTask');

    cy.intercept('PUT', '/api/tasks/123', {
      body: { message: 'Task updated successfully' },
    }).as('updateTask');

    cy.intercept('DELETE', '/api/tasks/123', {
      body: { message: 'Task deleted successfully' },
    }).as('deleteTask');

    // Navigate to the task details page
    cy.visit('/tasks/123'); // Adjust the URL if necessary
  });

  it('renders loading state initially and then task details', () => {
    cy.contains('Loading...').should('be.visible');
    cy.wait('@getTask');
    cy.contains('Test Task').should('be.visible');
    cy.contains('Assignee: 1').should('be.visible');
    cy.contains('Due Date: 2024-12-31').should('be.visible');
    cy.contains('Priority: Medium').should('be.visible');
    cy.contains('Status: Open').should('be.visible');
  });

  it('enters edit mode and updates task details', () => {
    cy.wait('@getTask');
    cy.contains('Edit').click();
    cy.get('input[name="title"]').clear().type('Updated Task');
    cy.get('input[name="assignee"]').clear().type('2');
    cy.get('input[name="dueDate"]').clear().type('2025-01-01');
    cy.get('#priority-select').click();
    cy.contains('High').click();
    cy.get('#status-select').click();
    cy.contains('In Progress').click();
    cy.contains('Save').click();
    cy.wait('@updateTask');
    cy.contains('Updated Task').should('be.visible');
  });

  it('cancels edit mode', () => {
    cy.wait('@getTask');
    cy.contains('Edit').click();
    cy.contains('Cancel').click();
    cy.contains('Test Task').should('be.visible');
  });

  it('deletes a task and navigates to tasks page', () => {
    cy.wait('@getTask');
    cy.contains('Delete').click();
    cy.wait('@deleteTask');
    cy.url().should('include', '/tasks');
  });

  it('shows snackbar on error when fetch fails', () => {
    cy.intercept('POST', '/api/tasks/123', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('failedGetTask');

    cy.visit('/tasks/123');
    cy.wait('@failedGetTask');
    cy.contains('Failed to load task details').should('be.visible');
  });
});