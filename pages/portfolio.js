import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [touchedCard, setTouchedCard] = useState(null);
  const [allProjects, setAllProjects] = useState(new Map()); // Store all loaded projects by page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const projectsPerPage = 4;

  // Load projects client-side
  useEffect(() => {
    loadInitialProjects();
  }, []);

  const loadInitialProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load first page
      const response = await fetch('/api/portfolio-paginated?page=1&limit=4');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const data = await response.json();
      const newAllProjects = new Map();
      newAllProjects.set(1, data.projects);

      setAllProjects(newAllProjects);
      setTotalPages(data.pagination.totalPages);

      // Start background loading of remaining pages
      if (data.pagination.totalPages > 1) {
        backgroundLoadPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const backgroundLoadPages = async (totalPagesCount) => {
    setBackgroundLoading(true);

    try {
      // Load pages 2 through totalPages in the background
      for (let page = 2; page <= totalPagesCount; page++) {
        const response = await fetch(`/api/portfolio-paginated?page=${page}&limit=4`);
        if (response.ok) {
          const data = await response.json();
          setAllProjects(prev => {
            const newMap = new Map(prev);
            newMap.set(page, data.projects);
            return newMap;
          });
        }
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error('Error background loading projects:', err);
    } finally {
      setBackgroundLoading(false);
    }
  };

  const loadPageOnDemand = async (pageNumber) => {
    if (allProjects.has(pageNumber)) {
      return; // Page already loaded
    }

    setPageLoading(true);
    try {
      const response = await fetch(`/api/portfolio-paginated?page=${pageNumber}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setAllProjects(prev => {
          const newMap = new Map(prev);
          newMap.set(pageNumber, data.projects);
          return newMap;
        });
      }
    } catch (err) {
      console.error('Error loading page on demand:', err);
    } finally {
      setPageLoading(false);
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

  // Pagination logic
  const currentProjects = allProjects.get(currentPage) || [];

  const goToNextPage = async () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      await loadPageOnDemand(nextPage);
      setCurrentPage(nextPage);
    }
  };

  const goToPreviousPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      await loadPageOnDemand(prevPage);
      setCurrentPage(prevPage);
    }
  };

  const isMobile = windowWidth <= 768;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextPage();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [currentPage, totalPages]);

  const getGridColumns = () => {
    if (windowWidth <= 768) return '1fr';
    return 'repeat(2, 1fr)';
  };

  const getGridGap = () => {
    if (windowWidth <= 768) return '10px';
    if (windowWidth <= 1024) return '15px';
    return '20px';
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
      aspectRatio: '1',
      overflow: 'hidden',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.3s ease',
      boxShadow: 'none',
      transform: isElevated ? 'scale(1.02)' : 'scale(1)'
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
              <button className="retry-button" onClick={loadInitialProjects}>
                Try Again
              </button>
            </div>
          ) : allProjects.size === 0 ? (
            <div className="loading-container">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌿</div>
              <div className="loading-text">No projects found</div>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Navigation Arrows */}
              {totalPages > 1 && (
                <>
                  {/* Previous Arrow */}
                  {currentPage > 1 && (
                    <button
                      onClick={goToPreviousPage}
                      style={{
                        position: 'fixed',
                        left: isMobile ? '50%' : '20px',
                        top: isMobile ? '20px' : '50%',
                        transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        transition: 'all 0.3s ease',
                        zIndex: 100,
                        padding: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1.2)' : 'translateY(-50%) scale(1.2)';
                        e.currentTarget.style.color = '#ddd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1)' : 'translateY(-50%) scale(1)';
                        e.currentTarget.style.color = '#fff';
                      }}
                    >
                      {isMobile ? '▲' : '‹'}
                    </button>
                  )}

                  {/* Next Arrow */}
                  {currentPage < totalPages && (
                    <button
                      onClick={goToNextPage}
                      style={{
                        position: 'fixed',
                        right: isMobile ? '50%' : '20px',
                        bottom: isMobile ? '20px' : 'auto',
                        top: isMobile ? 'auto' : '50%',
                        transform: isMobile ? 'translateX(50%)' : 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        transition: 'all 0.3s ease',
                        zIndex: 100,
                        padding: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(50%) scale(1.2)' : 'translateY(-50%) scale(1.2)';
                        e.currentTarget.style.color = '#ddd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(50%) scale(1)' : 'translateY(-50%) scale(1)';
                        e.currentTarget.style.color = '#fff';
                      }}
                    >
                      {isMobile ? '▼' : '›'}
                    </button>
                  )}
                </>
              )}

              {pageLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="projects-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: getGridColumns(),
                  gap: getGridGap(),
                  margin: '2rem 0'
                }}>
                  {currentProjects.map((project) => (
                    <Link href={`/projects/${project.slug}`} key={project.id} className="project-card"
                      style={getCardStyle(project.id)}
                      onMouseEnter={(e) => {
                        if (typeof window !== 'undefined' && !isTouchDevice()) {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          // Show overlay
                          const overlay = e.currentTarget.querySelector('.project-info');
                          if (overlay) overlay.style.opacity = '1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (typeof window !== 'undefined' && !isTouchDevice()) {
                          e.currentTarget.style.transform = 'scale(1)';
                          // Hide overlay
                          const overlay = e.currentTarget.querySelector('.project-info');
                          if (overlay) overlay.style.opacity = '0';
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
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        opacity: 0,
                        transition: 'all 0.3s ease'
                      }}>
                        <h3 style={{
                          color: 'white',
                          fontSize: '1.3rem',
                          fontWeight: '400',
                          textAlign: 'center',
                          margin: 0,
                          padding: '1rem',
                          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                        }}>{project.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {!loading && !pageLoading && <Footer />}
    </>
  );
}
