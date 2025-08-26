
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.main-nav')) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu backdrop */}
      <div
        className={`menu-backdrop ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      ></div>

      <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          <a href="./portfolio" className={currentPath === '/portfolio' ? 'cta' : ''} onClick={closeMenu}>Portfolio</a>
        </div>

        <a href="./" className="brand">
          TAPESTRY
        </a>

        {/* Burger Menu Button */}
        <button
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-right ${isMenuOpen ? 'open' : ''}`}>
          <a href="./portfolio" className={`mobile-only ${currentPath === '/portfolio' ? 'cta' : ''}`} onClick={closeMenu}>Portfolio</a>
          <a href="./contact" className={currentPath === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</a>
        </div>
      </nav>
    </>
  )
}
