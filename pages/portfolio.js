
import Head from 'next/head';
import Nav from '../components/Nav';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Portfolio({ projects }) {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [touchedCard, setTouchedCard] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Set initial window width only on client side
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

  const getGridColumns = () => {
    if (windowWidth <= 768) return '1fr';
    if (windowWidth <= 1024) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  };

  const getGridGap = () => {
    if (windowWidth <= 768) return '1rem';
    if (windowWidth <= 1024) return '1.5rem';
    return '2rem';
  };

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const handleCardInteraction = (projectId, isActive) => {
    if (isTouchDevice()) {
      setTouchedCard(isActive ? projectId : null);
    }
  };

  const getCardStyle = (projectId) => {
    // Only use touch state on client side, default to false on server
    const isElevated = typeof window !== 'undefined' && isTouchDevice() ? touchedCard === projectId : false;
    return {
      position: 'relative',
      aspectRatio: '4/3',
      overflow: 'hidden',
      borderRadius: '8px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: isElevated ? '0 12px 25px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      transform: isElevated ? 'translateY(-8px)' : 'translateY(0)'
    };
  };
  return (
    <>
      <Head>
        <title>Portfolio - Tapestry Vertical Gardens</title>
        <meta name="description" content="Our portfolio of vertical gardens and living wall projects across the UK." />
      </Head>

      <Nav />

      <main className="main-content">
        <div className="container">

          <div className="projects-grid" style={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: getGridGap(),
            margin: '2rem 0'
          }}>
            {projects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className="project-card"
                style={getCardStyle(project.id)}
                onMouseEnter={(e) => {
                  if (typeof window !== 'undefined' && !isTouchDevice()) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (typeof window !== 'undefined' && !isTouchDevice()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onTouchStart={() => handleCardInteraction(project.id, true)}
                onTouchEnd={() => handleCardInteraction(project.id, false)}
              >
                <div className="project-image" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  {project.hero_image && (
                    <Image 
                      src={project.hero_image} 
                      alt={project.title}
                      fill
                      style={{
                        objectFit: 'cover'
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  )}
                </div>
                <div className="project-info" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.4)'
                }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    margin: 0,
                    padding: '1rem',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    fontVariant: 'small-caps',
                    letterSpacing: '0.1em'
                  }}>{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const { getPortfolioItemsOptimized } = await import('../lib/database');
    const projects = await getPortfolioItemsOptimized();

    return {
      props: {
        projects: JSON.parse(JSON.stringify(projects)),
      },
      revalidate: 300, // Revalidate every 5 minutes (300 seconds)
    };
  } catch (error) {
    console.error('Failed to fetch portfolio items:', error);
    return {
      props: {
        projects: [],
      },
      revalidate: 10, // Retry after 10 seconds
    };
  }
}
