import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getPortfolioItemById } from '../../../lib/database';
import AdminLogin from '../../../components/AdminLogin';

export default function EditProject({ project, isAuthenticated }) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [formData, setFormData] = useState({
        title: project?.title || '',
        story: project?.story || '',
        slug: project?.slug || ''
    });
    const [heroImage, setHeroImage] = useState(project?.hero_image || '');
    const [galleryImages, setGalleryImages] = useState(project?.photos || []);
    const [isDragging, setIsDragging] = useState(false);
    const [isGalleryDragging, setIsGalleryDragging] = useState(false);
    const [saving, setSaving] = useState(false);

    const heroFileRef = useRef();
    const galleryFileRef = useRef();

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

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHeroDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files[0] && files[0].type.startsWith('image/')) {
            handleHeroImageUpload(files[0]);
        }
    };

    const handleGalleryDrop = (e) => {
        e.preventDefault();
        setIsGalleryDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        imageFiles.forEach(handleGalleryImageUpload);
    };

    const handleHeroImageUpload = (file) => {
        // In a real app, you'd upload to a server or cloud storage
        // For now, we'll use a data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setHeroImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newImage = {
                id: Date.now() + Math.random(),
                image_path: e.target.result,
                project_id: project?.id
            };
            setGalleryImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
    };

    const removeGalleryImage = (imageId) => {
        setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const updateData = {
                ...formData,
                hero_image: heroImage,
                gallery_images: galleryImages
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

    if (!project) {
        return <div>Project not found</div>;
    }

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
                                    Story
                                </label>
                                <textarea
                                    name="story"
                                    value={formData.story}
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

                    {/* Hero Image */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a202c' }}>
                            Hero Image
                        </h2>

                        <div
                            onDrop={handleHeroDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setIsDragging(true)}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => heroFileRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
                                borderRadius: '8px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragging ? '#eff6ff' : '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {heroImage ? (
                                <div>
                                    <img
                                        src={heroImage}
                                        alt="Hero preview"
                                        style={{
                                            maxWidth: '300px',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <p style={{ marginTop: '1rem', color: '#6b7280' }}>
                                        Click or drag to replace image
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                                    <p style={{ color: '#374151', fontWeight: '500' }}>
                                        Drop hero image here or click to upload
                                    </p>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            )}
                        </div>

                        <input
                            ref={heroFileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleHeroImageUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Gallery Images */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a202c' }}>
                            Gallery Images
                        </h2>

                        <div
                            onDrop={handleGalleryDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setIsGalleryDragging(true)}
                            onDragLeave={() => setIsGalleryDragging(false)}
                            onClick={() => galleryFileRef.current?.click()}
                            style={{
                                border: `2px dashed ${isGalleryDragging ? '#3b82f6' : '#d1d5db'}`,
                                borderRadius: '8px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isGalleryDragging ? '#eff6ff' : '#f9fafb',
                                transition: 'all 0.3s ease',
                                marginBottom: galleryImages.length > 0 ? '2rem' : '0'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
                            <p style={{ color: '#374151', fontWeight: '500' }}>
                                Drop gallery images here or click to upload
                            </p>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                PNG, JPG, GIF up to 10MB each
                            </p>
                        </div>

                        <input
                            ref={galleryFileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                Array.from(e.target.files).forEach(handleGalleryImageUpload);
                            }}
                            style={{ display: 'none' }}
                        />

                        {/* Gallery Preview */}
                        {galleryImages.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '1rem'
                            }}>
                                {galleryImages.map((image) => (
                                    <div key={image.id} style={{ position: 'relative' }}>
                                        <img
                                            src={image.image_path}
                                            alt="Gallery preview"
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(image.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
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
                                backgroundColor: saving ? '#9ca3af' : '#10b981',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                border: 'none',
                                borderRadius: '4px',
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
