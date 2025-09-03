import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function NewProject({ isAuthenticated }) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        slug: '',
        category: '',
        location: '',
        year: '',
        size: ''
    });
    const [projectImages, setProjectImages] = useState([]);
    const [draggedImageIndex, setDraggedImageIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef();

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

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-generate slug from title
            if (name === 'title') {
                updated.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }

            return updated;
        });
    };

    // Image handling functions
    const handleImageUpload = (files) => {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                // Compress image before converting to base64
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set maximum dimensions
                    const maxWidth = 1200;
                    const maxHeight = 800;

                    let { width, height } = img;

                    // Calculate new dimensions maintaining aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% quality

                    setProjectImages(prev => [...prev, compressedDataUrl]);
                };

                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
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
            const projectData = {
                ...formData,
                images: projectImages,
                features: [],
                plants: []
            };

            console.log('Submitting project data:', projectData);

            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                },
                body: JSON.stringify(projectData),
            });

            const responseData = await response.json();
            console.log('API response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create project');
            }

            alert('Project created successfully!');
            router.push('/admin/projects');
        } catch (error) {
            console.error('Error creating project:', error);
            alert(`Error creating project: ${error.message}. Please check the console for more details.`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Head>
                <title>New Project - Admin</title>
                <meta name="robots" content="noindex, nofollow" />
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
                `}</style>
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
                        Create New Project
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
                        borderRadius: '0',
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
                                    Title *
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
                                        borderRadius: '0',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
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
                                    Slug * (auto-generated from title)
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
                                        borderRadius: '0',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
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
                                    Description *
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
                                        borderRadius: '0',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                            borderRadius: '0',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
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
                                            borderRadius: '0',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                            borderRadius: '0',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
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
                                            borderRadius: '0',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Images */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0',
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
                                borderRadius: '0',
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
                                            borderRadius: '0',
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
                                                borderRadius: '0',
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
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
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
                            disabled={saving || !formData.title || !formData.slug}
                            style={{
                                backgroundColor: saving ? '#9ca3af' : '#10b981',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                border: 'none',
                                borderRadius: '0',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {saving ? 'Creating Project...' : 'Create Project'}
                        </button>
                    </div>
                </form>
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
