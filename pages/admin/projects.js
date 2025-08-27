import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function AdminProjects({ projects, totalCount, currentPage, isAuthenticated }) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const projectsPerPage = 10;
    const totalPages = Math.ceil(totalCount / projectsPerPage);

    useEffect(() => {
        // Check for stored token on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token');
            if (token && !authenticated) {
                setAuthenticated(true);
            }
        }
    }, [authenticated]);

    const handleLogin = (token) => {
        setAuthenticated(true);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
        }
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

            if (response.ok) {
                alert('Project deleted successfully!');
                window.location.reload(); // Refresh the page to show updated list
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project. Please try again.');
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
                <style jsx>{`
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
                        <span style={{ margin: '0 10px', color: '#6c757d' }}>Total: {totalCount}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Image</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Project Details</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Location</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Photos</th>
                                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                        No projects found
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>
                                            {project.coverImage ? (
                                                <img
                                                    src={project.coverImage}
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
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{project.title}</div>
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
                                                {project.photos ? project.photos.length : 0} photos
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
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '400px',
                            width: '90%'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#1a202c' }}>
                                Confirm Delete
                            </h3>
                            <p style={{ margin: '0 0 1.5rem 0', color: '#374151' }}>
                                Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={cancelDelete}
                                    disabled={deleting}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#f3f4f6',
                                        color: '#374151',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: deleting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(deleteConfirm.id)}
                                    disabled={deleting}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: deleting ? '#9ca3af' : '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: deleting ? 'not-allowed' : 'pointer'
                                    }}
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
