describe('Tasks Page', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      assignee: 'John Doe',
      dueDate: '2025-03-10',
      priority: 'High',
      status: 'Open',
      locked: false
    },
    {
      id: '2',
      title: 'Test Task 2',
      assignee: 'Jane Smith',
      dueDate: '2025-03-12',
      priority: 'Medium',
      status: 'In Progress',
      locked: true
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/tasks', {
      statusCode: 200,
      body: mockTasks
    }).as('getTasks');

    cy.visit('http://localhost:3000/tasks');
  });

  it('should load the tasks page', () => {
    cy.contains('h1', 'Task Management').should('be.visible');
    cy.get('.MuiTable-root').should('exist');
  });

  it('should display loading skeletons', () => {
    cy.get('[data-testid="loading-skeleton"]').should('have.length', 5);
    cy.wait('@getTasks');
    cy.get('[data-testid="loading-skeleton"]').should('not.exist');
  });

  it('should display task data correctly', () => {
    cy.wait('@getTasks');
    
    mockTasks.forEach((task, index) => {
      cy.get(`[data-testid="task-row-${index}"]`).within(() => {
        cy.contains(task.title);
        cy.contains(task.assignee);
        cy.contains(task.dueDate);
        cy.contains(task.priority);
        cy.contains(task.status);
      });
    });
  });

  it('should allow task deletion', () => {
    cy.intercept('DELETE', '/api/tasks/1', {
      statusCode: 200
    }).as('deleteTask');

    cy.wait('@getTasks');
    cy.get('[data-testid="task-row-0"]').find('[aria-label="Delete task"]').click();
    cy.wait('@deleteTask');
    cy.get('[data-testid="task-row-0"]').should('not.exist');
  });

  it('should show error on delete failure', () => {
    cy.intercept('DELETE', '/api/tasks/1', {
      statusCode: 500,
      body: { message: 'Delete failed' }
    }).as('deleteTask');

    cy.wait('@getTasks');
    cy.get('[data-testid="task-row-0"]').find('[aria-label="Delete task"]').click();
    cy.contains('Failed to delete task').should('be.visible');
  });

  it('should allow task editing', () => {
    cy.intercept('PUT', '/api/tasks/1', {
      statusCode: 200,
      body: {
        ...mockTasks[0],
        title: 'Updated Task',
        status: 'In Progress'
      }
    }).as('updateTask');

    cy.wait('@getTasks');
    cy.get('[data-testid="task-row-0"]').find('[aria-label="Edit task"]').click();
    
    // Edit title
    cy.get('[data-testid="task-title-input"]').clear().type('Updated Task');
    
    // Change status
    cy.get('[data-testid="task-status-select"]').click();
    cy.contains('In Progress').click();
    
    cy.get('[aria-label="Save changes"]').click();
    cy.wait('@updateTask');
    
    cy.contains('Updated Task').should('be.visible');
    cy.contains('In Progress').should('be.visible');
  });

  it('should toggle task lock status', () => {
    cy.wait('@getTasks');
    cy.get('[data-testid="task-row-0"]').find('[aria-label="Lock task"]').click();
    cy.get('[data-testid="task-row-0"]').find('[aria-label="Unlock task"]').should('exist');
  });

  it('should show admin controls', () => {
    cy.contains('button', 'Manage Users').should('be.visible');
  });
});