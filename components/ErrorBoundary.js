import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Track error in analytics if available
        if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
            window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false,
            });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    margin: '1rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
                        We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#2d5016',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500'
                            }}
                        >
                            Refresh Page
                        </button>
                        <a
                            href="/contact"
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'transparent',
                                color: '#2d5016',
                                border: '2px solid #2d5016',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                display: 'inline-block'
                            }}
                        >
                            Contact Support
                        </a>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                Error Details (Development)
                            </summary>
                            <pre style={{
                                backgroundColor: '#f3f4f6',
                                padding: '1rem',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                overflow: 'auto',
                                marginTop: '0.5rem'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
