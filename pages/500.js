import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Custom500() {
    return (
        <>
            <Head>
                <title>Server Error - Tapestry Vertical Gardens</title>
                <meta name="description" content="We're experiencing technical difficulties. Please try again later or contact us for assistance." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <Nav />

            <main style={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{
                        fontSize: '6rem',
                        margin: '0',
                        color: '#d32f2f',
                        fontWeight: 'bold'
                    }}>
                        500
                    </h1>

                    <h2 style={{
                        fontSize: '2rem',
                        margin: '1rem 0',
                        color: '#333'
                    }}>
                        Server Error
                    </h2>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        Something went wrong on our end. Our team has been notified and is working to fix the issue.
                        Please try again in a few minutes.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            href="/"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#2d5016',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1a2f0a'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}
                        >
                            Go Home
                        </Link>

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'transparent',
                                color: '#2d5016',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                border: '2px solid #2d5016',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2d5016';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#2d5016';
                            }}
                        >
                            Try Again
                        </button>

                        <Link
                            href="/contact"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'transparent',
                                color: '#2d5016',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                border: '2px solid #2d5016',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2d5016';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#2d5016';
                            }}
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
