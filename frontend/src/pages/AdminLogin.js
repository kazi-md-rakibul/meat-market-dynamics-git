import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (email === 'admin123@gmail.com' && password === 'admin123$$') {
                const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

                localStorage.setItem('adminToken', mockToken);

                navigate("/home/dashboard");
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    } 

    // Background animation effect
    const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBgPosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: `linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)`,
            backgroundPosition: `${bgPosition.x * 10}px ${bgPosition.y * 10}px`,
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                filter: 'blur(40px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '15%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                filter: 'blur(30px)'
            }} />
            
            {/* Back to home link */}
            <Link to="/" style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease'
            }}>
                <span style={{ fontSize: '1.2rem' }}>←</span> Back to Home
            </Link>

            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        color: '#4f46e5',
                        marginBottom: '0.5rem',
                        fontWeight: '700',
                        fontSize: '2rem'
                    }}>Admin Portal</h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '1rem'
                    }}>Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#4b5563',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>Email</label>
                        <div style={{
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '1.2rem'
                            }}>📧</div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    paddingLeft: '2.8rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                }}
                                placeholder="Enter admin email"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#4b5563',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>Password</label>
                        <div style={{
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '1.2rem'
                            }}>🔒</div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    paddingLeft: '2.8rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f9fafb',
                                    outline: 'none',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                }}
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '1rem',
                                    height: '1rem',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    animation: 'spin 1s linear infinite',
                                }}></span>
                                <span>Logging in...</span>
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </form>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <p style={{ fontWeight: '500' }}>Secure Admin Access Only</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                        fontSize: '0.8rem'
                    }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            <span style={{ color: '#10b981' }}>🔒</span> Encrypted
                        </span>
                        <span>|</span>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            <span style={{ color: '#10b981' }}>🛡️</span> Secure
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;