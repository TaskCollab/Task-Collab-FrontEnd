import { FormEvent, useState } from 'react';
import axios from 'axios';
import { login } from '../../API/AuthAPICall';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setMessage('Please fill in all fields');
            setIsError(true);
            return;
        }

        try {
            await login(username, password);
            setMessage('Login successful!');
            setIsError(false);
            //if we success login, then we jump to another website, waiting for that website. 
        } catch (error) {
            let errorMessage = 'An error occurred during login';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username/Email:</label>
                    <input
                        type="text"
                        id="username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="submit-btn">Login</button>
                
                {message && (
                    <div className={isError ? 'error-message' : 'success-message'}>
                        {message}
                    </div>
                )}
                
                <div className="forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
            </form>
        </div>
    );
};

export default Login;