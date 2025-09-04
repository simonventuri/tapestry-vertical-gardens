import Head from 'next/head';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function ProjectPage({ project }) {
    const router = useRouter();
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [windowWidth, setWindowWidth] = useState(1200);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (lightboxIndex === null) return;

            if (e.key === 'Escape') {
                setLightboxIndex(null);
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [lightboxIndex, project?.images]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    // Touch handlers for swipe functionality
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            navigateImage(1); // Next image
        } else if (isRightSwipe) {
            navigateImage(-1); // Previous image
        }

        // Reset
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const navigateImage = (direction) => {
        if (!project?.images || lightboxIndex === null) return;

        const newIndex = lightboxIndex + direction;
        if (newIndex >= 0 && newIndex < project.images.length) {
            setLightboxIndex(newIndex);
        }
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    // Ensure title is always a string to prevent React warning
    const pageTitle = Array.isArray(project.title) ? project.title.join(' ') : String(project.title || '');
    const fullTitle = `${pageTitle} - Tapestry Vertical Gardens`;

    return (
        <>
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={project.description?.substring(0, 160) || ''} />
            </Head>

            <Nav />

            <section className="section">
                <div className="container">
                    <div className="section-header" style={{ marginBottom: '0' }}>
                        <h1 style={{
                            fontSize: 'clamp(1.4rem, 1vw, 0.1rem)',
                            fontWeight: '700',
                            marginBottom: '2.5rem',
                            textAlign: 'center',
                            textTransform: 'uppercase !important',
                            letterSpacing: '0.15em',
                            color: 'var(--primary)'
                        }}>{pageTitle}</h1>
                        <div className="project-hero" style={{
                            width: '100%',
                            maxWidth: '1200px',
                            margin: '0 auto 0 auto',
                            borderRadius: '0',
                            overflow: 'hidden',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                            }}
                            onClick={() => openLightbox(0)}
                        >
                            <img src={project.images[0]} alt={project.title} style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                maxHeight: '600px',
                                objectFit: 'cover'
                            }} />
                        </div>
                    </div>

                    <div className="project-content" style={{
                        maxWidth: '800px',
                        margin: '1.5rem auto 3rem auto'
                    }}>
                        <div className="project-story" style={{ marginBottom: '3rem' }}>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.7',
                                color: 'var(--color-text)',
                                marginBottom: '1.5rem'
                            }}>{project.description}</p>
                        </div>

                        {/* Project Gallery - Additional Images */}
                        {project.images && project.images.length > 1 && (
                            <div className="project-gallery" style={{ marginBottom: '3rem' }}>
                                <div className="gallery-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '1.5rem',
                                    marginBottom: '2rem'
                                }}>
                                    <style jsx>{`
                                        @media (max-width: 768px) {
                                            .gallery-grid {
                                                grid-template-columns: repeat(2, 1fr) !important;
                                            }
                                        }
                                        @media (max-width: 480px) {
                                            .gallery-grid {
                                                grid-template-columns: 1fr !important;
                                            }
                                        }
                                    `}</style>
                                    {project.images.slice(1).map((image, index) => (
                                        <div key={index} className="gallery-item" style={{
                                            borderRadius: '0',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                            }}
                                            onClick={() => openLightbox(index + 1)}
                                        >
                                            <img src={image} alt={`${project.title} - Gallery Image ${index + 2}`} style={{
                                                width: '100%',
                                                height: '250px',
                                                objectFit: 'cover'
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="project-navigation" style={{
                        textAlign: 'center',
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--color-border)'
                    }}>
                        <button onClick={() => router.back()} style={{
                            display: 'inline-block',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0',
                            backgroundColor: 'var(--color-light)',
                            color: 'var(--color-dark)',
                            border: '2px solid var(--color-border)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-accent)';
                                e.target.style.color = 'white';
                                e.target.style.borderColor = 'var(--color-accent)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'var(--color-light)';
                                e.target.style.color = 'var(--color-dark)';
                                e.target.style.borderColor = 'var(--color-border)';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                            ← Back to Portfolio
                        </button>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Enhanced Lightbox with Navigation */}
            {lightboxIndex !== null && project?.images && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}
                    onClick={() => setLightboxIndex(null)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Previous Arrow - Fixed to left edge */}
                    {lightboxIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage(-1);
                            }}
                            style={{
                                position: 'fixed',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#fff',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                zIndex: 1001,
                                padding: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
                                e.currentTarget.style.color = '#ddd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.color = '#fff';
                            }}
                        >
                            ‹
                        </button>
                    )}

                    {/* Next Arrow - Fixed to right edge */}
                    {lightboxIndex < project.images.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage(1);
                            }}
                            style={{
                                position: 'fixed',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#fff',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                zIndex: 1001,
                                padding: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
                                e.currentTarget.style.color = '#ddd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.color = '#fff';
                            }}
                        >
                            ›
                        </button>
                    )}

                    {/* Close Button - Fixed to top-right corner */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#fff',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            zIndex: 1001,
                            padding: '10px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.2)';
                            e.currentTarget.style.color = '#ddd';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.color = '#fff';
                        }}
                    >
                        ×
                    </button>

                    <div style={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Main Image */}
                        <img
                            src={project.images[lightboxIndex]}
                            alt={`${project.title} - Image ${lightboxIndex + 1}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '0',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Image Counter */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-50px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#fff',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {lightboxIndex + 1} of {project.images.length}
                        </div>

                        {/* Mobile Navigation Instructions - Hide on mobile */}
                        {windowWidth > 768 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-90px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>
                                Use ← → arrow keys or click arrows to navigate
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export async function getStaticPaths() {
    // Return empty paths to avoid build-time database calls
    // Pages will be generated on-demand (ISR)
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }) {
    try {
        const { getPortfolioItem } = await import('../../lib/database');
        const project = await getPortfolioItem(params.slug);

        if (!project) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                project: JSON.parse(JSON.stringify(project)),
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Failed to fetch project:', error);
        return {
            notFound: true,
            revalidate: 10, // Retry after 10 seconds
        };
    }
}
