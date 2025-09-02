import { useEffect } from 'react';

export const usePerformanceMonitoring = () => {
    useEffect(() => {
        // Monitor Core Web Vitals
        const reportWebVitals = (metric) => {
            if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
                window.gtag('event', metric.name, {
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    non_interaction: true,
                });
            }
        };

        // Largest Contentful Paint (LCP)
        const observeLCP = () => {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                reportWebVitals({
                    name: 'LCP',
                    value: lastEntry.startTime,
                    id: 'LCP'
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        };

        // First Input Delay (FID)
        const observeFID = () => {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    reportWebVitals({
                        name: 'FID',
                        value: entry.processingStart - entry.startTime,
                        id: 'FID'
                    });
                });
            }).observe({ entryTypes: ['first-input'] });
        };

        // Cumulative Layout Shift (CLS)
        const observeCLS = () => {
            let clsValue = 0;
            let clsEntries = [];

            new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                });

                reportWebVitals({
                    name: 'CLS',
                    value: clsValue,
                    id: 'CLS'
                });
            }).observe({ entryTypes: ['layout-shift'] });
        };

        // Time to First Byte (TTFB)
        const observeTTFB = () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                reportWebVitals({
                    name: 'TTFB',
                    value: navigation.responseStart - navigation.requestStart,
                    id: 'TTFB'
                });
            }
        };

        // First Contentful Paint (FCP)
        const observeFCP = () => {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        reportWebVitals({
                            name: 'FCP',
                            value: entry.startTime,
                            id: 'FCP'
                        });
                    }
                });
            }).observe({ entryTypes: ['paint'] });
        };

        // Check if browser supports the APIs
        if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
            try {
                observeLCP();
                observeFID();
                observeCLS();
                observeTTFB();
                observeFCP();
            } catch (error) {
                console.warn('Performance monitoring error:', error);
            }
        }

        // Monitor page load time
        const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (pageLoadTime > 0 && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
            window.gtag('event', 'page_load_time', {
                value: pageLoadTime,
                event_category: 'Performance',
                non_interaction: true,
            });
        }

        // Monitor bundle size impact
        if (navigator.connection) {
            const connection = navigator.connection;
            window.gtag && window.gtag('event', 'connection_type', {
                connection_type: connection.effectiveType,
                downlink: connection.downlink,
                event_category: 'Performance',
                non_interaction: true,
            });
        }

    }, []);
};

export const measurePageLoad = (pageName) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
        const startTime = performance.now();

        return () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;

            window.gtag('event', 'page_render_time', {
                value: Math.round(loadTime),
                page_name: pageName,
                event_category: 'Performance',
                non_interaction: true,
            });
        };
    }

    return () => { }; // No-op function if analytics not available
};
