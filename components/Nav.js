
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [scrolled, setScrolled] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="./" className="brand">
        <img src="./images/logo.jpg" alt="Tapestry Vertical Gardens" />
      </a>
      <div className="links">
        <a href="./" className={currentPath === '/' ? 'cta' : ''}>Home</a>
        <a href="./about" className={currentPath === '/about' ? 'cta' : ''}>About</a>
        <a href="./portfolio" className={currentPath === '/portfolio' ? 'cta' : ''}>Portfolio</a>
        <a href="./benefits" className={currentPath === '/benefits' ? 'cta' : ''}>Benefits</a>
        <a href="./faqs" className={currentPath === '/faqs' ? 'cta' : ''}>FAQs</a>
        <a href="./contact" className="cta">Contact</a>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={`Current theme: ${theme} (${resolvedTheme}). Click to cycle through light/dark/system.`}
        >
          {getThemeIcon()}
        </button>
      </div>
    </nav>
  )
}
