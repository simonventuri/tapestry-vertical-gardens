import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        // Get stored theme or default to system
        const storedTheme = localStorage.getItem('theme') || 'system';
        setTheme(storedTheme);

        const updateResolvedTheme = (currentTheme) => {
            if (currentTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedTheme(prefersDark ? 'dark' : 'light');
            } else {
                setResolvedTheme(currentTheme);
            }
        };

        updateResolvedTheme(storedTheme);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateResolvedTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    useEffect(() => {
        // Apply theme to document
        if (resolvedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, [resolvedTheme]);

    const setThemeAndStore = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setResolvedTheme(prefersDark ? 'dark' : 'light');
        } else {
            setResolvedTheme(newTheme);
        }
    };

    const toggleTheme = () => {
        if (theme === 'light') {
            setThemeAndStore('dark');
        } else if (theme === 'dark') {
            setThemeAndStore('system');
        } else {
            setThemeAndStore('light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeAndStore, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
