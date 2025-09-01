import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../../components/AdminLogin';

export default function EditProject({ project, isAuthenticated }) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        slug: project?.slug || '',
        category: project?.category || '',
        location: project?.location || '',
        year: project?.year || '',
        size: project?.size || ''
    });
    const [projectImages, setProjectImages] = useState(project?.images || []);
    const [draggedImageIndex, setDraggedImageIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef();

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

    const handleLogin = (token) => {
        setAuthenticated(true);
    };

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Image handling functions
    const handleImageUpload = (files) => {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    setProjectImages(prev => [...prev, imageUrl]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleImageUpload(files);
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleImageUpload(files);
        }
    };

    const removeImage = (index) => {
        setProjectImages(prev => prev.filter((_, i) => i !== index));
    };

    const moveImage = (fromIndex, toIndex) => {
        setProjectImages(prev => {
            const newImages = [...prev];
            const [removed] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, removed);
            return newImages;
        });
    };

    const handleImageDragStart = (e, index) => {
        setDraggedImageIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleImageDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleImageDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedImageIndex !== null && draggedImageIndex !== targetIndex) {
            moveImage(draggedImageIndex, targetIndex);
        }
        setDraggedImageIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const updateData = {
                ...formData,
                images: projectImages,
                features: project.features || [],
                plants: project.plants || []
            };

            const response = await fetch(`/api/admin/projects/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to save project');
            }

            alert('Project saved successfully!');
            router.push('/admin');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Head>
                <title>Edit Project: {project.title} - Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #e2e8f0',
                    paddingBottom: '1rem'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>
                        Edit Project
                    </h1>
                    <Link
                        href="/admin"
                        style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '0.875rem'
                        }}
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a202c' }}>
                            Project Information
                        </h2>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Project Details */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a202c' }}>
                            Project Details
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Year
                                </label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Size
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Images */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a202c' }}>
                            Project Images
                        </h2>

                        <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            The first image will be used as the hero image. Drag and drop to reorder images.
                        </p>

                        {/* Upload Area */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
                                borderRadius: '8px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragging ? '#eff6ff' : '#f9fafb',
                                transition: 'all 0.3s ease',
                                marginBottom: '2rem'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                            <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Drop images here or click to upload
                            </p>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                PNG, JPG, GIF up to 10MB each
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />

                        {/* Image Gallery */}
                        {projectImages.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                {projectImages.map((image, index) => (
                                    <div
                                        key={index}
                                        draggable
                                        onDragStart={(e) => handleImageDragStart(e, index)}
                                        onDragOver={handleImageDragOver}
                                        onDrop={(e) => handleImageDrop(e, index)}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: '1/1',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            cursor: 'move',
                                            border: index === 0 ? '3px solid #3b82f6' : 'none'
                                        }}
                                    >
                                        {index === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                left: '0.5rem',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                zIndex: 2
                                            }}>
                                                HERO
                                            </div>
                                        )}
                                        <img
                                            src={image}
                                            alt={`Project image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 2
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div style={{ textAlign: 'center' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export async function getServerSideProps({ params, req }) {
    // Check authentication
    const isAuthenticated = !!req.cookies?.admin_token;

    try {
        const { getPortfolioItemById } = await import('../../../lib/database');
        const project = await getPortfolioItemById(params.id);

        if (!project) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                project: JSON.parse(JSON.stringify(project)),
                isAuthenticated
            }
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true
        };
    }
}
