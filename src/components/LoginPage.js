
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage({ updateUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();
    
    const isSignup = location.pathname === '/signup' || location.state?.mode === 'signup';

    // Check if user is already logged in and redirect them
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            console.log('User already logged in, redirecting to home...');
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isSignup && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/signin';
            const body = isSignup 
                ? { email, password, name }
                : { email, password };

            console.log('Sending request to:', `http://localhost:5001${endpoint}`);

            const response = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                console.log('Login successful, user data:', data.user);
                
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token || 'authenticated');
                
                // Update user state in App component
                if (updateUser) {
                    updateUser();
                }
                
                console.log('Redirecting to home page...');
                // Force redirect to home page
                // window.location.href = '/';
                window.location.reload();
                console.log('🔄 Redirect command executed');
                
            } else {
                console.log('❌ Login failed:', data);
                setError(data.error || 'Authentication failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                maxWidth: '400px',
                width: '100%',
                padding: '2rem',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </h2>
                
                {error && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '4px',
                        color: '#c33'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div style={{ marginBottom: '1rem'}}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={isSignup}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                    )}
                    
                    <div style={{ marginBottom: '1rem'}}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {isSignup && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={isSignup}
                                minLength="6"
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            marginBottom: '1rem'
                        }}
                    >
                        {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div style={{ textAlign: 'center' }}>
                    <p>
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => navigate(isSignup ? '/login' : '/signup')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isSignup ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}