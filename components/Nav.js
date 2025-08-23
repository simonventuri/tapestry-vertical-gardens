
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="main-nav">
      <a href="./" className="brand"><img src="./images/logo.jpg" alt="Tapestry Vertical Gardens" /></a>
      <div className="links">
        <a href="./" className={currentPath === '/' ? 'cta' : ''}>Home</a>
        <a href="./about" className={currentPath === '/about' ? 'cta' : ''}>About</a>
        <a href="./portfolio" className={currentPath === '/portfolio' ? 'cta' : ''}>Portfolio</a>
        <a href="./benefits" className={currentPath === '/benefits' ? 'cta' : ''}>Benefits</a>
        <a href="./faqs" className={currentPath === '/faqs' ? 'cta' : ''}>FAQs</a>
        <a href="./contact" className={currentPath === '/contact' ? 'cta' : ''}>Contact</a>
      </div>
    </nav>
  )
}
