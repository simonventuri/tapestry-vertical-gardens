import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Contact() {
    // Helper function to get label color
    const getLabelColor = () => {
        return '#1e293b';
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        projectType: '',
        location: '',
        budget: '',
        gdprConsent: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [submittedName, setSubmittedName] = useState('');

    const projectTypes = [
        'Residential Living Wall',
        'Commercial Installation',
        'Garden Design',
        'Maintenance & Care',
        'Consultation',
        'Other'
    ];

    const budgetRanges = [
        'Under £5,000',
        '£5,000 - £15,000',
        '£15,000 - £30,000',
        '£30,000 - £50,000',
        'Over £50,000',
        'Please advise'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            // Basic UK phone number validation
            const cleanPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
            const isValidUKPhone = /^(0[1-9]\d{8,9}|07\d{9}|\+44[1-9]\d{8,9}|\+\d{10,15}|\d{10,11})$/.test(cleanPhone);
            if (!isValidUKPhone) {
                newErrors.phone = 'Please enter a valid UK phone number (e.g., 07875 203901 or 01234 567890)';
            }
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Please tell us about your project';
        }

        if (!formData.projectType) {
            newErrors.projectType = 'Please select a project type';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.budget) {
            newErrors.budget = 'Please select a budget range';
        }

        if (!formData.gdprConsent) {
            newErrors.gdprConsent = 'You must agree to the data processing terms to submit this form';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Extract first name before clearing form data
                const firstName = formData.name.trim().split(' ')[0];
                setSubmittedName(firstName);
                setShowThankYou(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    projectType: '',
                    location: '',
                    budget: '',
                    gdprConsent: false
                });
                setErrors({});
            } else {
                alert(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowThankYou(false);
        setSubmittedName('');
    };

    return (
        <>
            <Head>
                <title>Contact — Tapestry Vertical Gardens</title>
                <meta name="description" content="Get in touch with Tapestry Vertical Gardens. Meet Adam Shepherd and our plant-first approach to living walls, grown in Devon and installed across the UK." />
                <link rel="canonical" href="https://www.tapestryverticalgardens.com/contact" />
                <meta property="og:image" content="./images/devon-nursery-vertical-gardens.jpg" />
            </Head>
            <Nav />

            {/* Header Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">Get In Touch</h1>
                        <p><strong>Founded by Adam Shepherd</strong> — a graphic designer turned horticulturalist trained at The English Gardening School in Chelsea — Tapestry blends two decades of design with a lifelong passion for plants.</p>

                        <div className="adam-portrait">
                            <img src="./images/adam-portrait.webp" alt="Adam Shepherd, founder of Tapestry Vertical Gardens" />
                        </div>
                        &nbsp;
                        <p className="section-subtitle">Ready to transform your space with a living wall? Let's discuss your vision.</p>
                        <div className="contact-form-container">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            htmlFor="name"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'error' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                        />
                                        {errors.name && <div className="error-message">{errors.name}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Email address *
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'error' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                        />
                                        {errors.email && <div className="error-message">{errors.email}</div>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            htmlFor="phone"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Phone number *
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'error' : ''}`}
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="07123 456789"
                                        />
                                        {errors.phone && <div className="error-message">{errors.phone}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label
                                            htmlFor="location"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Project location *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.location ? 'error' : ''}`}
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, County or Postcode"
                                        />
                                        {errors.location && <div className="error-message">{errors.location}</div>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            htmlFor="projectType"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Project type *
                                        </label>
                                        <select
                                            className={`form-control ${errors.projectType ? 'error' : ''}`}
                                            id="projectType"
                                            name="projectType"
                                            value={formData.projectType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select project type</option>
                                            {projectTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.projectType && <div className="error-message">{errors.projectType}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label
                                            htmlFor="budget"
                                            className="form-label"
                                            style={{ color: getLabelColor() }}
                                        >
                                            Budget range *
                                        </label>
                                        <select
                                            className={`form-control ${errors.budget ? 'error' : ''}`}
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select budget range</option>
                                            {budgetRanges.map(range => (
                                                <option key={range} value={range}>{range}</option>
                                            ))}
                                        </select>
                                        {errors.budget && <div className="error-message">{errors.budget}</div>}
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label
                                        htmlFor="message"
                                        className="form-label"
                                        style={{ color: getLabelColor() }}
                                    >
                                        Tell us about your project *
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.message ? 'error' : ''}`}
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Please describe your vision, any specific requirements, timeline, or questions you may have..."
                                    ></textarea>
                                    {errors.message && <div className="error-message">{errors.message}</div>}
                                </div>

                                {/* GDPR Consent */}
                                <div className="form-group gdpr-consent">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            name="gdprConsent"
                                            checked={formData.gdprConsent}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                gdprConsent: e.target.checked
                                            }))}
                                            className={errors.gdprConsent ? 'error' : ''}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="consent-text">
                                            I consent to Tapestry Vertical Gardens collecting and processing my personal data
                                            (name, email, phone number, and message) to respond to my enquiry.
                                            Your data will be stored securely and used only for this purpose.
                                            For more details, see our <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                                            You can request deletion of your data at any time by contacting us. *
                                        </span>
                                    </label>
                                    {errors.gdprConsent && <div className="error-message">{errors.gdprConsent}</div>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="contact-info-section">
                <div className="container">
                    <div className="contact-info-grid">
                        <div className="contact-person">
                            <h3>ADAM SHEPHERD</h3>
                            <p><a href="mailto:adam@tapestryverticalgardens.com">adam@tapestryverticalgardens.com</a></p>
                            <p><a href="tel:07875203901">07875 203901</a></p>
                        </div>

                        <div className="contact-company">
                            <h3>TAPESTRY VERTICAL GARDENS</h3>
                            <p><a href="mailto:info@tapestryverticalgardens.com">info@tapestryverticalgardens.com</a></p>
                            <p>Greenslade Nursery<br />
                                Greenslade Road<br />
                                Blackawton<br />
                                Totnes<br />
                                Devon<br />
                                TQ9 7BP</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thank You Modal */}
            {showThankYou && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Thank You!</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="success-icon">✓</div>
                            <p>Thank you for your enquiry, <strong>{submittedName || 'there'}</strong>!</p>
                            <p>We'll be in touch shortly to discuss your project and answer any questions you may have.</p>
                            <p className="modal-subtext">You should receive a confirmation email shortly.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style jsx>{`
                .contact-form-container {
                    max-width: 800px;
                    margin: 40px auto 0;
                }

                .form-row {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-group {
                    flex: 1;
                    margin-bottom: 20px;
                }

                .form-group.full-width {
                    width: 100%;
                }

                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                    font-size: 14px;
                }

                .form-control {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e1e5e9;
                    
                    font-size: 16px;
                    transition: border-color 0.2s ease;
                    box-sizing: border-box;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #2d5016;
                }

                .form-control.error {
                    border-color: #dc3545;
                }

                .form-control::placeholder {
                    color: #6c757d;
                }

                select.form-control {
                    cursor: pointer;
                }

                .error-message {
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: 5px;
                }

                /* GDPR Consent Styling */
                .gdpr-consent {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f8f9fa;
                    
                    border: 1px solid #e9ecef;
                }

                .checkbox-container {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    cursor: pointer;
                    position: relative;
                    padding-left: 0;
                    margin: 0;
                    line-height: 1.4;
                }

                .checkbox-container input[type="checkbox"] {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }

                .checkmark {
                    flex-shrink: 0;
                    height: 18px;
                    width: 18px;
                    background-color: white;
                    border: 2px solid #ddd;
                    
                    position: relative;
                    margin-top: 2px;
                }

                .checkbox-container:hover input ~ .checkmark {
                    border-color: #2d5016;
                }

                .checkbox-container input:checked ~ .checkmark {
                    background-color: #2d5016;
                    border-color: #2d5016;
                }

                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }

                .checkbox-container input:checked ~ .checkmark:after {
                    display: block;
                }

                .checkbox-container .checkmark:after {
                    left: 5px;
                    top: 1px;
                    width: 6px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .consent-text {
                    font-size: 14px;
                    color: #495057;
                    line-height: 1.5;
                }

                .consent-text a {
                    color: #2d5016;
                    text-decoration: underline;
                }

                .consent-text a:hover {
                    color: #1e3a0f;
                }

                .checkbox-container input.error ~ .checkmark {
                    border-color: #dc3545;
                }

                .submit-btn {
                    background-color: #2d5016;
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    margin-top: 10px;
                }

                .submit-btn:hover:not(:disabled) {
                    background-color: #1a3009;
                }

                .submit-btn:disabled {
                    background-color: #6c757d;
                    cursor: not-allowed;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px 30px 0;
                }

                .modal-header h2 {
                    margin: 0;
                    color: #2d5016;
                    font-size: 24px;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 30px;
                    cursor: pointer;
                    color: #999;
                    line-height: 1;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close:hover {
                    color: #333;
                }

                .modal-body {
                    padding: 20px 30px;
                    text-align: center;
                }

                .success-icon {
                    width: 60px;
                    height: 60px;
                    background-color: #28a745;
                    color: white;
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    font-weight: bold;
                    margin: 0 auto 20px;
                }

                .modal-body p {
                    margin: 15px 0;
                    font-size: 16px;
                    line-height: 1.5;
                }

                .modal-subtext {
                    color: #6c757d;
                    font-size: 14px !important;
                }

                .modal-footer {
                    padding: 0 30px 30px;
                    text-align: center;
                }

                .modal-footer .btn {
                    background-color: #2d5016;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .modal-footer .btn:hover {
                    background-color: #1a3009;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .form-row {
                        flex-direction: column;
                        gap: 0;
                    }

                    .contact-form-container {
                        padding: 0 10px;
                    }

                    .modal-content {
                        margin: 20px;
                        max-width: calc(100% - 40px);
                    }

                    .modal-header,
                    .modal-body,
                    .modal-footer {
                        padding-left: 20px;
                        padding-right: 20px;
                    }
                }

                /* Contact Information Section */
                .contact-info-section {
                    background-color: #f8f9fa;
                    padding: 40px 0;
                    border-top: 1px solid #dee2e6;
                }

                .contact-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .contact-person,
                .contact-company {
                    text-align: center;
                }

                .contact-person h3,
                .contact-company h3 {
                    color: #2d5016;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 15px;
                    letter-spacing: 0.5px;
                    text-align: center;
                }

                .contact-person p,
                .contact-company p {
                    color: #495057;
                    margin-bottom: 8px;
                    line-height: 1.6;
                    text-align: center;
                }

                .contact-person a,
                .contact-company a {
                    color: #2d5016;
                    text-decoration: none;
                }

                .contact-person a:hover,
                .contact-company a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .contact-info-section {
                        padding: 30px 0;
                    }

                    .contact-info-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                        margin: 0 20px;
                    }
                }
            `}</style>
        </>
    )
}