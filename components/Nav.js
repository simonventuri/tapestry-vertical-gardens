
export default function Nav() {
  return (
    <nav className="nav">
      <a href="/" className="brand"><img src="/images/logo.jpg" alt="Tapestry Vertical Gardens" /></a>
      <div className="links">
        <a href="/about">About</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/benefits">Benefits</a>
        <a href="/faqs">FAQs</a>
        <a href="/contact" className="cta">Contact</a>
      </div>
    </nav>
  )
}
