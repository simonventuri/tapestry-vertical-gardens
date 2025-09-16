import Head from 'next/head';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function ProjectPage({ project }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    // Close lightbox on Escape key
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);
    const [lightboxScrollTo, setLightboxScrollTo] = useState(0);
    const imageRefs = useRef([]);
    const [imageLoadStates, setImageLoadStates] = useState([]); // true = loaded, false = loading
    const [windowWidth, setWindowWidth] = useState(1200);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Scroll to the clicked image when modal opens
    useEffect(() => {
        if (lightboxOpen && imageRefs.current[lightboxScrollTo]) {
            imageRefs.current[lightboxScrollTo].scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    }, [lightboxOpen, lightboxScrollTo]);
    const router = useRouter();
    // (Declarations moved above)

    // Remove keyboard navigation logic for lightboxIndex (not needed for vertical scroll modal)

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

    // (Declarations moved above)
    const openLightbox = (index = 0) => {
        setLightboxOpen(true);
        setLightboxScrollTo(index);
        if (project?.images) {
            setImageLoadStates(Array(project.images.length).fill(false));
        }
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
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

    // Preload images when lightbox opens
    useEffect(() => {
        if (!lightboxOpen || !project?.images) return;
        let isMounted = true;
        project.images.forEach((src, idx) => {
            const img = new window.Image();
            img.onload = () => {
                if (isMounted) setImageLoadStates(prev => {
                    const next = [...prev];
                    next[idx] = true;
                    return next;
                });
            };
            img.onerror = () => {
                if (isMounted) setImageLoadStates(prev => {
                    const next = [...prev];
                    next[idx] = true; // treat errored as loaded to remove spinner
                    return next;
                });
            };
            img.src = src;
        });
        return () => { isMounted = false; };
    }, [lightboxOpen, project?.images]);

    const anyLoading = imageLoadStates.some(loaded => !loaded);

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
                        <div className="project-story" style={{ marginBottom: '3rem', textAlign: 'center' }}>
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
            </section >

            <Footer />

            {/* Lightbox Modal: Vertical Scrollable Images */}
            {lightboxOpen && project?.images && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 1000,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: '40px 0 40px 0',
                        cursor: 'pointer',
                    }}
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
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
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            zIndex: 1001,
                            padding: '10px',
                        }}
                        aria-label="Close lightbox"
                    >×</button>
                    {/* Spinner overlay if any images are loading */}
                    {anyLoading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.3)',
                            zIndex: 1002,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div className="spinner" style={{ width: 60, height: 60, borderWidth: 8 }}></div>
                        </div>
                    )}
                    {/* Vertically stacked images */}
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        alignItems: 'center',
                        margin: '0 auto',
                    }}>
                        {project.images.map((src, idx) => (
                            <img
                                key={src}
                                ref={el => imageRefs.current[idx] = el}
                                src={src}
                                alt={`${project.title} - Image ${idx + 1}`}
                                style={{
                                    width: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: '0',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    opacity: imageLoadStates[idx] ? 1 : 0.5,
                                    transition: 'opacity 0.3s',
                                    pointerEvents: 'none',
                                }}
                                onLoad={() => setImageLoadStates(prev => {
                                    const next = [...prev];
                                    next[idx] = true;
                                    return next;
                                })}
                                onClick={e => e.stopPropagation()}
                            />
                        ))}
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
