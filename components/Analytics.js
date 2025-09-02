import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAnalytics() {
    const router = useRouter();

    useEffect(() => {
        if (!window.gtag || !process.env.NEXT_PUBLIC_GA_ID) return;

        const handleRouteChange = (url) => {
            window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
                page_path: url,
            });
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
}

// Custom event tracking
export function trackEvent(action, category, label, value) {
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Contact form submission tracking
export function trackContactSubmission(projectType) {
    trackEvent('submit', 'Contact Form', projectType);
}

// Project view tracking
export function trackProjectView(projectTitle) {
    trackEvent('view', 'Project', projectTitle);
}

// Portfolio interaction tracking
export function trackPortfolioInteraction(action, projectTitle) {
    trackEvent(action, 'Portfolio', projectTitle);
}
