
import Head from 'next/head';
import Nav from '../components/Nav';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [touchedCard, setTouchedCard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects client-side
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const projectsData = await response.json();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <style jsx>{`
            .spinner {
              width: 50px;
              height: 50px;
              border: 5px solid #f3f3f3;
              border-top: 5px solid #2d5016;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .loading-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 80px 20px;
              text-align: center;
            }

            .error-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 80px 20px;
              text-align: center;
              color: #dc3545;
            }

            .retry-button {
              margin-top: 20px;
              padding: 12px 24px;
              background: #2d5016;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 600;
              transition: background-color 0.3s ease;
            }

            .retry-button:hover {
              background: #1e3a0f;
            }

            .loading-text {
              margin-top: 20px;
              color: #6b7280;
              font-size: 18px;
            }
          `}</style>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-container">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌱</div>
              <h2 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Oops! Something went wrong</h2>
              <p style={{ margin: '0 0 20px 0', color: '#6b7280' }}>
                We couldn't load our portfolio right now. Please try again.
              </p>
              <button className="retry-button" onClick={loadProjects}>
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="loading-container">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌿</div>
              <div className="loading-text">No projects found</div>
            </div>
          ) : (
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
                    height: '100%'
                  }}>
                    <img src={project.hero_image} alt={project.title} style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} />
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
          )}
        </div>
      </main>
    </>
  );
}
