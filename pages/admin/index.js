import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication status with server
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/verify', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    setAuthenticated(true);
                } else {
                    // Clear invalid tokens
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('admin_token');
                    }
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('admin_token');
                }
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = (token) => {
        setAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            // Call server logout endpoint
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Clear client-side data
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
        }
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setAuthenticated(false);
    };

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard - Tapestry Vertical Gardens</title>
                <meta name="robots" content="noindex, nofollow" />
                <style>{`
                    /* Force light theme for admin pages */
                    html, body {
                        color-scheme: light !important;
                        background-color: white !important;
                        color: #1a202c !important;
                    }
                    html[data-theme="dark"], body[data-theme="dark"] {
                        color-scheme: light !important;
                        background-color: white !important;
                        color: #1a202c !important;
                    }
                    * {
                        color-scheme: light !important;
                    }
                `}</style>
            </Head>
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ margin: 0, color: '#2d5016' }}>Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* Project Management Card */}
                    <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '30px',
                        backgroundColor: '#f8f9fa',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '15px',
                            color: '#2d5016'
                        }}>
                            🌿
                        </div>
                        <h2 style={{
                            margin: '0 0 15px 0',
                            color: '#2d5016',
                            fontSize: '24px'
                        }}>
                            Project Management
                        </h2>
                        <p style={{
                            margin: '0 0 20px 0',
                            color: '#666',
                            lineHeight: '1.5'
                        }}>
                            Manage portfolio projects, add new installations, edit project details, and organize your gallery.
                        </p>
                        <Link href="/admin/projects" style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#2d5016',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3610'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}>
                            Manage Projects
                        </Link>
                    </div>

                    {/* Contact Management Card */}
                    <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '30px',
                        backgroundColor: '#f8f9fa',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '15px',
                            color: '#2d5016'
                        }}>
                            📧
                        </div>
                        <h2 style={{
                            margin: '0 0 15px 0',
                            color: '#2d5016',
                            fontSize: '24px'
                        }}>
                            Contact Messages
                        </h2>
                        <p style={{
                            margin: '0 0 20px 0',
                            color: '#666',
                            lineHeight: '1.5'
                        }}>
                            View and manage customer inquiries, contact form submissions, and client communications.
                        </p>
                        <Link href="/admin/contacts" style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#2d5016',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3610'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}>
                            View Messages
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginTop: '20px'
                }}>
                    <h3 style={{
                        margin: '0 0 15px 0',
                        color: '#2d5016',
                        fontSize: '18px'
                    }}>
                        Quick Access
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <Link href="/admin/new" style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}>
                            + Add New Project
                        </Link>
                        <Link href="/" style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}>
                            View Website
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ req }) {
    // Check authentication
    const isAuthenticated = !!req.cookies?.admin_token;

    return {
        props: {
            isAuthenticated
        }
    };
}
