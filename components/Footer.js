
export default function Footer() {
  const handleCookieSettings = () => {
    if (typeof window !== 'undefined' && window.manageCookiePreferences) {
      window.manageCookiePreferences();
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; {new Date().getFullYear()} Tapestry Vertical Gardens.<br />All rights reserved.</p>
            <p>Tapestry Vertical Gardens &mdash; vibrant, sustainable, and grown in Devon.</p>
          </div>
          <div className="footer-links">
            <button
              onClick={handleCookieSettings}
              className="cookie-settings-btn"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
