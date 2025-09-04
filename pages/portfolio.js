import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Portfolio() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [touchedCard, setTouchedCard] = useState(null);
  const [allProjects, setAllProjects] = useState(new Map()); // Store all loaded projects by page
  const [displayedProjects, setDisplayedProjects] = useState([]); // For infinite scroll on mobile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();
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
      setDisplayedProjects(data.projects); // Initialize displayed projects for mobile
      setTotalPages(data.pagination.totalPages);
      setHasMoreToLoad(data.pagination.totalPages > 1);

      // Start background loading of remaining pages for desktop
      if (data.pagination.totalPages > 1 && windowWidth > 768) {
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

  // Load more projects for infinite scroll on mobile
  const loadMoreProjects = useCallback(async () => {
    if (loadingMore || !hasMoreToLoad) return;

    const nextPage = Math.floor(displayedProjects.length / projectsPerPage) + 1;
    if (nextPage > totalPages) {
      setHasMoreToLoad(false);
      return;
    }

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/portfolio-paginated?page=${nextPage}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setDisplayedProjects(prev => [...prev, ...data.projects]);
        setHasMoreToLoad(nextPage < totalPages);
      }
    } catch (err) {
      console.error('Error loading more projects:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [displayedProjects.length, totalPages, loadingMore, hasMoreToLoad, projectsPerPage]);

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

  // Intersection Observer for infinite scroll on mobile
  useEffect(() => {
    if (windowWidth > 768) return; // Only on mobile

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreToLoad && !loadingMore) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [windowWidth, hasMoreToLoad, loadingMore, loadMoreProjects]);

  const isMobile = windowWidth <= 768;

  // Pagination logic - use different data source for mobile vs desktop
  const currentProjects = isMobile ? displayedProjects : (allProjects.get(currentPage) || []);

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

  // Keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return; // Don't enable keyboard navigation on mobile

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
  }, [currentPage, totalPages, isMobile]);

  const getGridColumns = () => {
    if (windowWidth <= 768) return '1fr';
    return 'repeat(2, 1fr)';
  };

  const getGridGap = () => {
    if (windowWidth <= 768) return '5px';
    if (windowWidth <= 1024) return '5px';
    return '5px';
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
      transform: isElevated ? 'scale(1.05)' : 'scale(1.0)' // Increased to full size
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Head>
        <title>Portfolio - Tapestry Vertical Gardens</title>
        <meta name="description" content="Our portfolio of vertical gardens and living wall projects across the UK." />
      </Head>

      <Nav />

      <main className="main-content" style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="container" style={{ flexGrow: 1 }}>
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
              {/* Navigation Arrows - Desktop Only */}
              {totalPages > 1 && !isMobile && (
                <>
                  {/* Previous Arrow */}
                  {currentPage > 1 && (
                    <button
                      onClick={goToPreviousPage}
                      style={{
                        position: 'absolute',
                        left: isMobile ? '50%' : '-10px',
                        top: isMobile ? '-60px' : '49%',
                        transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
                        background: '#fff',
                        border: '2px solid #000',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#000',
                        textShadow: 'none',
                        transition: 'all 0.3s ease',
                        zIndex: 100,
                        padding: '8px 12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1.1)' : 'translateY(-50%) scale(1.1)';
                        e.currentTarget.style.backgroundColor = '#000';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(-50%) scale(1)' : 'translateY(-50%) scale(1)';
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
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
                        position: 'absolute',
                        right: isMobile ? '50%' : '-10px',
                        bottom: isMobile ? '-60px' : 'auto',
                        top: isMobile ? 'auto' : '49%',
                        transform: isMobile ? 'translateX(50%)' : 'translateY(-50%)',
                        background: '#fff',
                        border: '2px solid #000',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#000',
                        textShadow: 'none',
                        transition: 'all 0.3s ease',
                        zIndex: 100,
                        padding: '8px 12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(50%) scale(1.1)' : 'translateY(-50%) scale(1.1)';
                        e.currentTarget.style.backgroundColor = '#000';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = isMobile ? 'translateX(50%) scale(1)' : 'translateY(-50%) scale(1)';
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
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
                  margin: '2rem 0 0 0',
                  padding: '5px calc(12% - 5px)' // Reduced padding by 5px
                }}>
                  {currentProjects.map((project) => (
                    <Link href={`/projects/${project.slug}`} key={project.id} className="project-card"
                      style={getCardStyle(project.id)}
                      onMouseEnter={(e) => {
                        if (typeof window !== 'undefined' && !isTouchDevice()) {
                          e.currentTarget.style.transform = 'scale(1.0)'; // No size change on hover
                          // Show overlay
                          const overlay = e.currentTarget.querySelector('.project-info');
                          if (overlay) overlay.style.opacity = '1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (typeof window !== 'undefined' && !isTouchDevice()) {
                          e.currentTarget.style.transform = 'scale(1.0)'; // Stay at full size
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

              {/* Pagination Indicators - Desktop Only */}
              {totalPages > 1 && !loading && !pageLoading && !isMobile && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '1rem 0',
                  gap: '8px'
                }}>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => {
                        const targetPage = index + 1;
                        if (targetPage !== currentPage) {
                          if (targetPage > currentPage) {
                            for (let i = 0; i < (targetPage - currentPage); i++) {
                              setTimeout(() => goToNextPage(), i * 100);
                            }
                          } else {
                            for (let i = 0; i < (currentPage - targetPage); i++) {
                              setTimeout(() => goToPreviousPage(), i * 100);
                            }
                          }
                        }
                      }}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '0',
                        border: '1px solid #000',
                        backgroundColor: currentPage === (index + 1) ? '#000' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: '0'
                      }}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Infinite Scroll Trigger and Loading - Mobile Only */}
              {isMobile && (
                <>
                  {/* Trigger element for infinite scroll */}
                  <div ref={observerRef} style={{ height: '10px', width: '100%' }} />
                  
                  {/* Loading indicator for infinite scroll */}
                  {loadingMore && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '2rem 0'
                    }}>
                      <div className="spinner"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      {!loading && !pageLoading && <Footer />}
    </div>
  );
}
