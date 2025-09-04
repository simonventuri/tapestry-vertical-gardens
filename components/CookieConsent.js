import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [consentGiven, setConsentGiven] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Don't show banner on landing page
        if (router.pathname === '/') {
            return;
        }

        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (consent === null) {
            setShowBanner(true);
        } else {
            setConsentGiven(consent === 'accepted');
            // If consent was given, enable analytics
            if (consent === 'accepted') {
                enableAnalytics();
            }
        }
    }, [router.pathname]);

    const enableAnalytics = () => {
        // Enable Google Analytics
        if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const disableAnalytics = () => {
        // Disable Google Analytics
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    };

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setConsentGiven(true);
        setShowBanner(false);
        enableAnalytics();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setConsentGiven(false);
        setShowBanner(false);
        disableAnalytics();
    };

    const handleManagePreferences = () => {
        // Reset consent to show banner again
        localStorage.removeItem('cookie-consent');
        setShowBanner(true);
        setConsentGiven(null);
    };

    if (!showBanner) {
        return (
            <button
                onClick={handleManagePreferences}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    padding: '8px 12px',
                    backgroundColor: '#2d5016',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    opacity: 0.7
                }}
            >
                Cookie Settings
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderBottom: 'none',
            padding: '20px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <p style={{
                            margin: '0 0 10px 0',
                            fontSize: '14px',
                            color: '#333',
                            lineHeight: '1.4'
                        }}>
                            <strong>We use cookies to improve your experience</strong>
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#666',
                            lineHeight: '1.4'
                        }}>
                            We use essential cookies for site functionality and analytics cookies to help us understand how you use our website.
                            You can manage your preferences or learn more in our{' '}
                            <a href="/privacy" style={{ color: '#2d5016', textDecoration: 'underline' }}>
                                Privacy Policy
                            </a>.
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={handleDecline}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: 'transparent',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f5f5f5';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            Essential Only
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2d5016',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#1e3610';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#2d5016';
                            }}
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
