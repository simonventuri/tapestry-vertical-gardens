import { useState } from 'react';
import Head from 'next/head';

export default function AdminLogin({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('admin_token', token);
                onLogin(token);
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Head>
                <title>Admin Login - Tapestry Vertical Gardens</title>
                <meta name="robots" content="noindex, nofollow" />
                <style jsx>{`
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .login-form {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 450px;
            border: 1px solid #e5e7eb;
          }
          .login-title {
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 2rem;
            color: #1a202c;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 1rem;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
          }
          .form-row {
            border-bottom: 1px solid #f3f4f6;
          }
          .form-label-cell {
            padding: 0.75rem 1rem 0.75rem 0;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            width: 30%;
            vertical-align: middle;
            text-align: right;
            border-right: 1px solid #f3f4f6;
            background-color: #fafafa;
          }
          .form-input-cell {
            padding: 0.75rem 0 0.75rem 1rem;
            vertical-align: middle;
          }
          .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
            background-color: white;
          }
          .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .button-row {
            border: none;
          }
          .button-cell {
            padding: 1rem 0;
            text-align: center;
          }
          .login-button {
            width: 100%;
            background: #3b82f6;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .login-button:hover:not(:disabled) {
            background: #2563eb;
          }
          .login-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            text-align: center;
          }
          .back-link {
            text-align: center;
            margin-top: 1rem;
          }
          .back-link a {
            color: #6b7280;
            text-decoration: none;
            font-size: 0.875rem;
          }
        `}</style>
            </Head>

            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1 className="login-title">Admin Login</h1>

                    <table className="form-table">
                        <tbody>
                            <tr className="form-row">
                                <td className="form-label-cell">
                                    <label htmlFor="username">Username:</label>
                                </td>
                                <td className="form-input-cell">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                        autoComplete="username"
                                    />
                                </td>
                            </tr>
                            <tr className="form-row">
                                <td className="form-label-cell">
                                    <label htmlFor="password">Password:</label>
                                </td>
                                <td className="form-input-cell">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                        autoComplete="current-password"
                                    />
                                </td>
                            </tr>
                            <tr className="button-row">
                                <td colSpan="2" className="button-cell">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="login-button"
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {error && <div className="error-message">{error}</div>}

                    <div className="back-link">
                        <a href="/">← Back to Site</a>
                    </div>
                </form>
            </div>
        </>
    );
}
