import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function ContentManagement() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeSection, setActiveSection] = useState('hero');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/admin/verify', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                setAuthenticated(true);
                loadContent();
            } else {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('admin_token');
                }
                setAuthenticated(false);
                setLoading(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
            }
            setAuthenticated(false);
            setLoading(false);
        }
    };

    const loadContent = async () => {
        try {
            const response = await fetch('/api/admin/content', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setContent(data);
            } else {
                throw new Error('Failed to load content');
            }
        } catch (error) {
            console.error('Error loading content:', error);
            setMessage('Error loading content');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (token) => {
        setAuthenticated(true);
        loadContent();
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
        }
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setAuthenticated(false);
    };

    const saveContent = async () => {
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/admin/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(content)
            });

            if (response.ok) {
                setMessage('Content saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                throw new Error('Failed to save content');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage('Error saving content');
        } finally {
            setSaving(false);
        }
    };

    const resetContent = async () => {
        if (!confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/admin/content', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setContent(data.content);
                setMessage('Content reset to default successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                throw new Error('Failed to reset content');
            }
        } catch (error) {
            console.error('Error resetting content:', error);
            setMessage('Error resetting content');
        } finally {
            setSaving(false);
        }
    };

    const updateContent = (section, field, value, index = null) => {
        const newContent = { ...content };

        if (index !== null) {
            // Handle array updates (like FAQs or benefits)
            if (section === 'faqs') {
                newContent.faqs[index][field] = value;
            } else if (section === 'whyVerticalGardens') {
                newContent.whyVerticalGardens.benefits[index][field] = value;
            } else if (section === 'tapestryDifference') {
                newContent.tapestryDifference.features[index][field] = value;
            }
        } else if (field.includes('.')) {
            // Handle nested fields
            const fields = field.split('.');
            let current = newContent[section];
            for (let i = 0; i < fields.length - 1; i++) {
                current = current[fields[i]];
            }
            current[fields[fields.length - 1]] = value;
        } else {
            // Handle simple field updates
            newContent[section][field] = value;
        }

        setContent(newContent);
    };

    const addFAQ = () => {
        const newContent = { ...content };
        newContent.faqs.push({ question: '', answer: '' });
        setContent(newContent);
    };

    const removeFAQ = (index) => {
        const newContent = { ...content };
        newContent.faqs.splice(index, 1);
        setContent(newContent);
    };

    const addBenefit = () => {
        const newContent = { ...content };
        newContent.whyVerticalGardens.benefits.push({ title: '', description: '' });
        setContent(newContent);
    };

    const removeBenefit = (index) => {
        const newContent = { ...content };
        newContent.whyVerticalGardens.benefits.splice(index, 1);
        setContent(newContent);
    };

    const addFeature = () => {
        const newContent = { ...content };
        newContent.tapestryDifference.features.push({ title: '', description: '' });
        setContent(newContent);
    };

    const removeFeature = (index) => {
        const newContent = { ...content };
        newContent.tapestryDifference.features.splice(index, 1);
        setContent(newContent);
    };

    const uploadImage = async (file, section, field) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/admin/upload-image', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                updateContent(section, field, data.filePath);
                setMessage('Image uploaded successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    if (!content) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div>Loading content...</div>
            </div>
        );
    }

    const sections = [
        { key: 'hero', label: 'Hero Section' },
        { key: 'whyVerticalGardens', label: 'Why Vertical Gardens' },
        { key: 'tapestryDifference', label: 'Tapestry Difference' },
        { key: 'livingSculpture', label: 'Living Sculpture' },
        { key: 'faqs', label: 'FAQs' }
    ];

    return (
        <>
            <Head>
                <title>Content Management - Tapestry Vertical Gardens</title>
                <meta name="robots" content="noindex, nofollow" />
                <style>{`
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

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#2d5016' }}>Content Management</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Manage home page content and sections</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link href="/admin" style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0',
                            fontSize: '14px'
                        }}>
                            ← Back to Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                {message && (
                    <div style={{
                        padding: '10px 15px',
                        backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
                        color: message.includes('Error') ? '#721c24' : '#155724',
                        border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
                        marginBottom: '20px',
                        borderRadius: '0'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Section Navigation */}
                    <div style={{ width: '250px', flexShrink: 0 }}>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            borderRadius: '0'
                        }}>
                            <div style={{
                                padding: '15px',
                                borderBottom: '1px solid #ddd',
                                backgroundColor: '#2d5016',
                                color: 'white'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Sections</h3>
                            </div>
                            {sections.map(section => (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        border: 'none',
                                        backgroundColor: activeSection === section.key ? '#e9ecef' : 'transparent',
                                        color: activeSection === section.key ? '#2d5016' : '#666',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                        fontWeight: activeSection === section.key ? 'bold' : 'normal'
                                    }}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={saveContent}
                                disabled={saving}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: saving ? '#ccc' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={resetContent}
                                disabled={saving}
                                style={{
                                    padding: '10px 16px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '0',
                            padding: '20px'
                        }}>
                            {activeSection === 'hero' && (
                                <div>
                                    <h2 style={{ marginTop: 0, color: '#2d5016' }}>Hero Section</h2>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={content.hero.title}
                                            onChange={(e) => updateContent('hero', 'title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={content.hero.subtitle}
                                            onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={content.hero.description}
                                            onChange={(e) => updateContent('hero', 'description', e.target.value)}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                CTA Button Text
                                            </label>
                                            <input
                                                type="text"
                                                value={content.hero.ctaText}
                                                onChange={(e) => updateContent('hero', 'ctaText', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '0',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                CTA Link
                                            </label>
                                            <input
                                                type="text"
                                                value={content.hero.ctaLink}
                                                onChange={(e) => updateContent('hero', 'ctaLink', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '0',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Hero Image Path
                                            </label>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    value={content.hero.image}
                                                    onChange={(e) => updateContent('hero', 'image', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '0',
                                                        fontSize: '16px'
                                                    }}
                                                />
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                uploadImage(e.target.files[0], 'hero', 'image');
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                        id="hero-image-upload"
                                                    />
                                                    <label
                                                        htmlFor="hero-image-upload"
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '10px 15px',
                                                            backgroundColor: uploading ? '#ccc' : '#007bff',
                                                            color: 'white',
                                                            cursor: uploading ? 'not-allowed' : 'pointer',
                                                            borderRadius: '0',
                                                            fontSize: '14px',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Upload'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Image Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={content.hero.imageAlt}
                                                onChange={(e) => updateContent('hero', 'imageAlt', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '0',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'whyVerticalGardens' && (
                                <div>
                                    <h2 style={{ marginTop: 0, color: '#2d5016' }}>Why Vertical Gardens Section</h2>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={content.whyVerticalGardens.title}
                                            onChange={(e) => updateContent('whyVerticalGardens', 'title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Section Subtitle
                                        </label>
                                        <textarea
                                            value={content.whyVerticalGardens.subtitle}
                                            onChange={(e) => updateContent('whyVerticalGardens', 'subtitle', e.target.value)}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0, color: '#2d5016' }}>Benefits</h3>
                                            <button
                                                onClick={addBenefit}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                + Add Benefit
                                            </button>
                                        </div>

                                        {content.whyVerticalGardens.benefits.map((benefit, index) => (
                                            <div key={index} style={{
                                                border: '1px solid #eee',
                                                padding: '15px',
                                                marginBottom: '15px',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <h4 style={{ margin: 0, color: '#2d5016' }}>Benefit {index + 1}</h4>
                                                    <button
                                                        onClick={() => removeBenefit(index)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '0',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={benefit.title}
                                                        onChange={(e) => updateContent('whyVerticalGardens', 'title', e.target.value, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '0',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={benefit.description}
                                                        onChange={(e) => updateContent('whyVerticalGardens', 'description', e.target.value, index)}
                                                        rows={3}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '0',
                                                            fontSize: '14px',
                                                            resize: 'vertical'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'tapestryDifference' && (
                                <div>
                                    <h2 style={{ marginTop: 0, color: '#2d5016' }}>Tapestry Difference Section</h2>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={content.tapestryDifference.title}
                                            onChange={(e) => updateContent('tapestryDifference', 'title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Section Subtitle
                                        </label>
                                        <textarea
                                            value={content.tapestryDifference.subtitle}
                                            onChange={(e) => updateContent('tapestryDifference', 'subtitle', e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0, color: '#2d5016' }}>Features</h3>
                                            <button
                                                onClick={addFeature}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                + Add Feature
                                            </button>
                                        </div>

                                        {content.tapestryDifference.features.map((feature, index) => (
                                            <div key={index} style={{
                                                border: '1px solid #eee',
                                                padding: '15px',
                                                marginBottom: '15px',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <h4 style={{ margin: 0, color: '#2d5016' }}>Feature {index + 1}</h4>
                                                    <button
                                                        onClick={() => removeFeature(index)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '0',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                        Title (HTML allowed)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => updateContent('tapestryDifference', 'title', e.target.value, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '0',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={feature.description}
                                                        onChange={(e) => updateContent('tapestryDifference', 'description', e.target.value, index)}
                                                        rows={4}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '0',
                                                            fontSize: '14px',
                                                            resize: 'vertical'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'livingSculpture' && (
                                <div>
                                    <h2 style={{ marginTop: 0, color: '#2d5016' }}>Living Sculpture Section</h2>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={content.livingSculpture.title}
                                            onChange={(e) => updateContent('livingSculpture', 'title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={content.livingSculpture.description}
                                            onChange={(e) => updateContent('livingSculpture', 'description', e.target.value)}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                fontSize: '16px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Image Path
                                            </label>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    value={content.livingSculpture.image}
                                                    onChange={(e) => updateContent('livingSculpture', 'image', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '0',
                                                        fontSize: '16px'
                                                    }}
                                                />
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                uploadImage(e.target.files[0], 'livingSculpture', 'image');
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                        id="sculpture-image-upload"
                                                    />
                                                    <label
                                                        htmlFor="sculpture-image-upload"
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '10px 15px',
                                                            backgroundColor: uploading ? '#ccc' : '#007bff',
                                                            color: 'white',
                                                            cursor: uploading ? 'not-allowed' : 'pointer',
                                                            borderRadius: '0',
                                                            fontSize: '14px',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Upload'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Image Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={content.livingSculpture.imageAlt}
                                                onChange={(e) => updateContent('livingSculpture', 'imageAlt', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '0',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'faqs' && (
                                <div>
                                    <h2 style={{ marginTop: 0, color: '#2d5016' }}>FAQs Section</h2>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ margin: 0, color: '#2d5016' }}>Frequently Asked Questions</h3>
                                        <button
                                            onClick={addFAQ}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            + Add FAQ
                                        </button>
                                    </div>

                                    {content.faqs.map((faq, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #eee',
                                            padding: '15px',
                                            marginBottom: '15px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <h4 style={{ margin: 0, color: '#2d5016' }}>FAQ {index + 1}</h4>
                                                <button
                                                    onClick={() => removeFAQ(index)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '0',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                    Question
                                                </label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => updateContent('faqs', 'question', e.target.value, index)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '0',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                                    Answer
                                                </label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => updateContent('faqs', 'answer', e.target.value, index)}
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '0',
                                                        fontSize: '14px',
                                                        resize: 'vertical'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
