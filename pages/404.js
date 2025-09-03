import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Page Not Found - Tapestry Vertical Gardens</title>
                <meta name="description" content="Sorry, the page you're looking for doesn't exist. Explore our vertical garden portfolio and services." />
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
                        color: '#2d5016',
                        fontWeight: 'bold'
                    }}>
                        404
                    </h1>

                    <h2 style={{
                        fontSize: '2rem',
                        margin: '1rem 0',
                        color: '#333'
                    }}>
                        Page Not Found
                    </h2>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        The page you're looking for seems to have grown somewhere else.
                        Let us help you find what you need.
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
                                borderRadius: '0',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1a2f0a'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}
                        >
                            Go Home
                        </Link>

                        <Link
                            href="/portfolio"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'transparent',
                                color: '#2d5016',
                                textDecoration: 'none',
                                borderRadius: '0',
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
                            View Portfolio
                        </Link>

                        <Link
                            href="/contact"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'transparent',
                                color: '#2d5016',
                                textDecoration: 'none',
                                borderRadius: '0',
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
                            Contact Us
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
