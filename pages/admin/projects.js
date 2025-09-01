import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function AdminProjects({ projects, totalCount, currentPage, isAuthenticated }) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [clientProjects, setClientProjects] = useState(projects);
    const [clientTotalCount, setClientTotalCount] = useState(totalCount);
    const [mounted, setMounted] = useState(false);
    const projectsPerPage = 10;
    const totalPages = Math.ceil(clientTotalCount / projectsPerPage);

    useEffect(() => {
        setMounted(true);
        // Process projects on client side to handle any data format issues
        const processedProjects = projects.map(project => {
            let images = project.images;
            if (typeof images === 'string') {
                try {
                    images = JSON.parse(images);
                } catch {
                    images = [];
                }
            }
            if (!Array.isArray(images)) {
                images = [];
            }

            return {
                ...project,
                images: images
            };
        });
        setClientProjects(processedProjects);
        setClientTotalCount(totalCount);
    }, [projects, totalCount]);

    useEffect(() => {
        // Only trust server-side authentication, don't auto-authenticate from localStorage
        // The server-side props should be the source of truth
        if (!isAuthenticated && authenticated) {
            // If server says not authenticated but client thinks it is, clear client state
            setAuthenticated(false);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
            }
        }
    }, [isAuthenticated, authenticated]);

    // Handle keyboard events for modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && deleteConfirm && !deleting) {
                cancelDelete();
            }
        };

        if (deleteConfirm) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restore body scroll
            document.body.style.overflow = 'unset';
        };
    }, [deleteConfirm, deleting]);

    const handleLogin = (token) => {
        setAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            // Call logout API to clear server-side session
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout API error:', error);
        }

        // Clear client-side storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            sessionStorage.clear();
        }

        // Clear cookies
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Set state and force reload to clear any cached authentication
        setAuthenticated(false);

        // Force a page reload to ensure clean state
        window.location.reload();
    };

    const handleDeleteProject = async (projectId) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/admin/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                },
            });

            const responseData = await response.json();

            if (response.ok) {
                // Remove the project from the client state and update total count
                const updatedProjects = clientProjects.filter(project => project.id !== projectId);
                setClientProjects(updatedProjects);
                setClientTotalCount(prevCount => prevCount - 1);

                // Check if current page becomes empty after deletion
                const newTotalPages = Math.ceil((clientTotalCount - 1) / projectsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    // Redirect to the last valid page
                    window.location.href = `/admin/projects?page=${newTotalPages}`;
                    return;
                }

                alert('Project deleted successfully!');
            } else {
                throw new Error(responseData.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert(`Error deleting project: ${error.message}. Please try again.`);
        } finally {
            setDeleting(false);
            setDeleteConfirm(null);
        }
    };

    const confirmDelete = (project) => {
        setDeleteConfirm(project);
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <>
            <Head>
                <title>Project Management - Admin - Tapestry Vertical Gardens</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="color-scheme" content="light only" />
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
          /* Additional override for any dark theme classes */
          .dark, [data-theme="dark"], [class*="dark"] {
            background-color: white !important;
            color: #1a202c !important;
          }
          /* Override any component backgrounds */
          div, section, main, table, th, td {
            background-color: inherit !important;
          }
          .admin-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 1rem;
          }
          .admin-title {
            font-size: 2rem;
            font-weight: bold;
            color: #1a202c;
            margin: 0;
          }
          .admin-count {
            color: #64748b;
          }
          .projects-table {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            border-collapse: collapse;
          }
          .table-header {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          .table-header th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #374151;
          }
          .table-row {
            border-bottom: 1px solid #e2e8f0;
          }
          .table-row:hover {
            background: #f9fafb;
          }
          .table-cell {
            padding: 1rem;
            color: #1f2937;
          }
          .edit-button {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          .edit-button:hover {
            background: #2563eb;
          }
          .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
          }
          .page-link {
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 4px;
            border: 1px solid #d1d5db;
          }
          .page-link.active {
            background: #3b82f6;
            color: white;
          }
          .page-link.inactive {
            background: #f3f4f6;
            color: #374151;
          }
          .back-link {
            text-align: center;
            margin-top: 3rem;
          }
          .back-link a {
            color: #6b7280;
            text-decoration: none;
            font-size: 0.875rem;
          }
          
          /* Modal Animation */
          @keyframes modalSlideIn {
            0% {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
            </Head>

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <Link href="/admin" style={{
                            color: '#2d5016',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            ← Back to Admin Dashboard
                        </Link>
                        <h1 style={{ margin: 0, color: '#2d5016' }}>Project Management</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Image</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Project Details</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Location</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Photos</th>
                                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!mounted ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : clientProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                        No projects found
                                    </td>
                                </tr>
                            ) : (
                                clientProjects.map((project) => (
                                    <tr key={project.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={project.images[0]}
                                                    alt={project.title}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        backgroundColor: '#f3f4f6',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#9ca3af',
                                                        fontSize: '12px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                >
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1f2937' }}>{project.title}</div>
                                            <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '2px' }}>
                                                Created: {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {project.id}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ color: '#374151' }}>{project.location || 'Not specified'}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ color: '#374151' }}>
                                                {project.images ? project.images.length : 0} photo{project.images && project.images.length !== 1 ? 's' : ''}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Link
                                                    href={`/admin/edit/${project.id}`}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#2d5016',
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(project)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <span style={{ color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>
                        Total Projects: {clientTotalCount}
                    </span>
                    <Link
                        href="/admin/new"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + New Project
                    </Link>
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '10px' }}>
                        <Link
                            href={`/admin/projects?page=${Math.max(currentPage - 1, 1)}`}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentPage === 1 ? '#ccc' : '#2d5016',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                pointerEvents: currentPage === 1 ? 'none' : 'auto'
                            }}
                        >
                            Previous
                        </Link>

                        <span style={{ margin: '0 20px' }}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <Link
                            href={`/admin/projects?page=${Math.min(currentPage + 1, totalPages)}`}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentPage === totalPages ? '#ccc' : '#2d5016',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                pointerEvents: currentPage === totalPages ? 'none' : 'auto'
                            }}
                        >
                            Next
                        </Link>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            backdropFilter: 'blur(2px)'
                        }}
                        onClick={(e) => {
                            // Close modal when clicking outside the modal content
                            if (e.target === e.currentTarget && !deleting) {
                                cancelDelete();
                            }
                        }}
                    >
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            animation: 'modalSlideIn 0.2s ease-out',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#dc2626',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                Confirm Delete
                            </h3>
                            <p style={{
                                margin: '0 0 1.5rem 0',
                                color: '#374151',
                                lineHeight: '1.6'
                            }}>
                                Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={cancelDelete}
                                    disabled={deleting}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        background: '#f9fafb',
                                        color: '#374151',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'all 0.15s ease',
                                        ':hover': {
                                            background: '#f3f4f6'
                                        }
                                    }}
                                    onMouseEnter={(e) => !deleting && (e.target.style.background = '#f3f4f6')}
                                    onMouseLeave={(e) => !deleting && (e.target.style.background = '#f9fafb')}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(deleteConfirm.id)}
                                    disabled={deleting}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        background: deleting ? '#9ca3af' : '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => !deleting && (e.target.style.background = '#b91c1c')}
                                    onMouseLeave={(e) => !deleting && (e.target.style.background = '#dc2626')}
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps({ query, req }) {
    // Check authentication
    const isAuthenticated = !!req.cookies?.admin_token;

    const page = parseInt(query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        // Get paginated projects
        const { getPortfolioItems } = await import('../../lib/database');
        const allProjects = await getPortfolioItems();
        const totalCount = allProjects.length;
        const projects = allProjects.slice(offset, offset + limit);

        return {
            props: {
                projects: JSON.parse(JSON.stringify(projects)),
                totalCount,
                currentPage: page,
                isAuthenticated
            }
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            props: {
                projects: [],
                totalCount: 0,
                currentPage: 1,
                isAuthenticated
            }
        };
    }
}
