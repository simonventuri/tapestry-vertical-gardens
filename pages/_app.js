
import '../styles/globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import CookieConsent from '../components/CookieConsent'
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring'
import Head from 'next/head'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
    // Initialize performance monitoring
    usePerformanceMonitoring();

    // Initialize Google Analytics with consent mode
    useEffect(() => {
        if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
            // Initialize consent mode
            window.gtag('consent', 'default', {
                'analytics_storage': 'denied'
            });

            // Check if consent was previously given
            const consent = localStorage.getItem('cookie-consent');
            if (consent === 'accepted') {
                window.gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }

            // Track page view
            window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
                page_title: document.title,
                page_location: window.location.href,
            });
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#2d5016" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />

                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />

                {/* Default Meta Tags */}
                <meta name="description" content="Tapestry Vertical Gardens - Expert vertical garden design and installation in London. Transform your space with stunning living walls and green installations." />
                <meta name="keywords" content="vertical gardens, living walls, green walls, London, garden design, plant installation, sustainable gardening" />
                <meta name="author" content="Tapestry Vertical Gardens" />

                {/* OpenGraph Meta Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Tapestry Vertical Gardens" />
                <meta property="og:image" content="/images/hero-vertical-gardens-uk.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="/images/hero-vertical-gardens-uk.jpg" />
            </Head>

            <ErrorBoundary>
                <Component {...pageProps} />
                <CookieConsent />
            </ErrorBoundary>

            {/* Google Analytics - will respect consent mode */}
            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </>
    )
}
