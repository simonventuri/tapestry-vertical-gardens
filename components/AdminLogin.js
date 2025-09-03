import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token in localStorage for API calls
                if (typeof window !== 'undefined') {
                    localStorage.setItem('admin_token', data.token);
                }

                // Call onLogin callback and reload page to get fresh server-side auth
                onLogin(data.token);
                window.location.reload();
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            margin: 0,
            padding: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
        }}>
            {/* Back to Website Link */}
            <div style={{ marginBottom: '20px' }}>
                <a
                    href="/"
                    style={{
                        color: '#2d5016',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '0',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <span style={{ fontSize: '18px' }}>←</span>
                    Back to Website
                </a>
            </div>

            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '400px',
                maxWidth: '90vw'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: '#2d5016'
                }}>
                    Admin Login
                </h1>

                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '0',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#1a202c',
                            letterSpacing: '0.025em'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '0',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#1a202c',
                            letterSpacing: '0.025em'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '0',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: loading ? '#ccc' : '#2d5016',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}