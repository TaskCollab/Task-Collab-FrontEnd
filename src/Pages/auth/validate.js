function validateForm() {
    const usernameEmail = document.getElementById('usernameEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('message');

    if (usernameEmail === '' || password === '') {
        showMessage('Both fields are required.', 'error');
        return false;
    }

    const isAuthenticated = authenticateUser(usernameEmail, password);

    if (isAuthenticated) {
        showMessage('Login successful!', 'success');
        // I can enter a new website if login success, but I need to create a new one first.
    } else {
        showMessage('Invalid username or password. Please try again.', 'error');
    }

    return false;
}

function authenticateUser(usernameEmail, password) {
    const validUsernameEmail = '12345@example.com';
    const validPassword = 'rightPassword';
    return usernameEmail === validUsernameEmail && password === validPassword;
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}
