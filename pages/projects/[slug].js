import Head from 'next/head';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ProjectPage({ project }) {
    const router = useRouter();
    const [lightboxImage, setLightboxImage] = useState(null);

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
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                            fontWeight: '700',
                            marginBottom: '2.5rem',
                            textAlign: 'center',
                            color: 'var(--primary)'
                        }}>{pageTitle}</h1>
                        <div className="project-hero" style={{
                            width: '100%',
                            maxWidth: '1200px',
                            margin: '0 auto 0 auto',
                            borderRadius: '12px',
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
                            onClick={() => setLightboxImage(project.images[0])}
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
                                            borderRadius: '8px',
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
                                            onClick={() => setLightboxImage(image)}
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
                            borderRadius: '6px',
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

            {/* Lightbox */}
            {lightboxImage && (
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
                    onClick={() => setLightboxImage(null)}
                >
                    <div style={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={lightboxImage}
                            alt="Full size image"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setLightboxImage(null)}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '-40px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
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
