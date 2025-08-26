
import { useTheme } from './ThemeProvider';

export default function Footer() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === 'system') {
      return '🖥️';
    } else if (resolvedTheme === 'dark') {
      return '🌙';
    } else {
      return '☀️';
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; {new Date().getFullYear()} Tapestry Vertical Gardens. All rights reserved.</p>
            <p>Bringing life to walls across the UK</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle footer-theme-toggle"
            title={`Current theme: ${theme} (${resolvedTheme}). Click to cycle through light/dark/system.`}
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </footer>
  )
}
