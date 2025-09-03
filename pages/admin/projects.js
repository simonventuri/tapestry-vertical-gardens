import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function AdminProjects({ isAuthenticated }) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [clientProjects, setClientProjects] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [reordering, setReordering] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load projects client-side
    useEffect(() => {
        if (authenticated) {
            loadProjects();
        }
    }, [authenticated]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/admin/projects-list');
            if (!response.ok) {
                throw new Error('Failed to load projects');
            }

            const projects = await response.json();

            // Process projects to handle any data format issues
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
        } catch (err) {
            console.error('Error loading projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize authentication state from server-side props
    useEffect(() => {
        setAuthenticated(isAuthenticated);
    }, [isAuthenticated]);

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

        // Set state to show login form
        setAuthenticated(false);
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
                // Remove the project from the client state
                const updatedProjects = clientProjects.filter(project => project.id !== projectId);
                setClientProjects(updatedProjects);
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

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedIndex(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newProjects = [...clientProjects];
        const draggedProject = newProjects[draggedIndex];

        // Remove dragged project and insert at new position
        newProjects.splice(draggedIndex, 1);
        newProjects.splice(dropIndex, 0, draggedProject);

        setClientProjects(newProjects);

        // Save new order to database
        await saveProjectOrder(newProjects);
    };

    const saveProjectOrder = async (orderedProjects) => {
        setReordering(true);
        try {
            const orderedIds = orderedProjects.map(project => project.id);
            const response = await fetch('/api/admin/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                },
                body: JSON.stringify({ orderedIds }),
            });

            if (!response.ok) {
                throw new Error('Failed to save project order');
            }
        } catch (error) {
            console.error('Error saving project order:', error);
            alert('Failed to save project order. Please refresh and try again.');
        } finally {
            setReordering(false);
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
            cursor: move;
            transition: all 0.2s ease;
          }
          .table-row:hover {
            background: #f9fafb;
          }
          .table-row.dragging {
            opacity: 0.5;
            transform: scale(0.98);
          }
          .table-row.drag-over {
            background: #eff6ff;
            border-top: 2px solid #3b82f6;
          }
          .drag-handle {
            color: #9ca3af;
            margin-right: 8px;
            cursor: grab;
          }
          .drag-handle:active {
            cursor: grabbing;
          }
          .reordering-notice {
            background: #fef3c7;
            color: #92400e;
            padding: 8px 12px;
            
            font-size: 14px;
            margin-bottom: 16px;
            text-align: center;
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
            
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          .edit-button:hover {
            background: #2563eb;
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

          /* Spinner Animation */
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            
            animation: spin 1s linear infinite;
          }

          .small-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff33;
            border-top: 2px solid #ffffff;
            
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1a202c' }}>
                            Manage Projects
                            <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 'normal', marginLeft: '10px' }}>
                                ({clientProjects.length})
                            </span>
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={loadProjects}
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                background: loading ? '#6c757d' : '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            title="Refresh projects list"
                        >
                            {loading ? (
                                <>
                                    <div className="small-spinner"></div>
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    🔄 Refresh
                                </>
                            )}
                        </button>
                        <Link href="/admin/new" style={{
                            padding: '10px 20px',
                            background: '#2d5016',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            + Add New Project
                        </Link>
                    </div>
                </div>

                {reordering && (
                    <div className="reordering-notice">
                        💾 Saving new project order...
                    </div>
                )}

                <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '0', overflow: 'hidden' }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #ddd',
                        color: '#374151',
                        fontSize: '14px'
                    }}>
                        💡 <strong>Tip:</strong> Drag and drop rows to reorder projects. Changes are saved automatically.
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Order</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Image</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Project Details</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Location</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Photos</th>
                                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd', color: '#1f2937', fontWeight: 'bold' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#6c757d' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                            <div className="spinner"></div>
                                            <span>Loading projects...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <span>❌ Error loading projects: {error}</span>
                                            <button
                                                onClick={loadProjects}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : !mounted ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : clientProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                        No projects found
                                    </td>
                                </tr>
                            ) : (
                                clientProjects.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`table-row ${draggedIndex === index ? 'dragging' : ''}`}
                                        style={{ borderBottom: '1px solid #eee' }}
                                    >
                                        <td style={{ padding: '15px', width: '60px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="drag-handle">⋮⋮</span>
                                                <span style={{
                                                    background: '#f3f4f6',
                                                    padding: '4px 8px',
                                                    borderRadius: '0',
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    fontWeight: '500'
                                                }}>
                                                    #{index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={project.images[0]}
                                                    alt={project.title}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '0',
                                                        border: '1px solid #ddd'
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        backgroundColor: '#f3f4f6',
                                                        borderRadius: '0',
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
                                                {project.imageCount || 0} photo{(project.imageCount || 0) !== 1 ? 's' : ''}
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
                                                        borderRadius: '0',
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
                                                        borderRadius: '0',
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
                        Total Projects: {clientProjects.length}
                    </span>
                    <Link
                        href="/admin/new"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + New Project
                    </Link>
                </div>

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
                            borderRadius: '0',
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
                                        borderRadius: '0',
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
                                        borderRadius: '0',
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

export async function getServerSideProps({ req }) {
    // Check authentication
    const isAuthenticated = !!req.cookies?.admin_token;

    return {
        props: {
            isAuthenticated
        }
    };
}
