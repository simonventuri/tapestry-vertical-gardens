import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(1);
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeClass('fade-out');

      setTimeout(() => {
        // Change image during black screen
        setCurrentImage(prev => prev >= 11 ? 1 : prev + 1);
        // Start fade in
        setFadeClass('fade-in');
      }, 400); // Half of transition time

    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    router.push('/home');
  };

  return (
    <>
      <Head>
        <title>Tapestry Vertical Gardens</title>
        <meta name="description" content="Vertical gardens and living walls designed, grown in Devon, and installed across the UK." />
        <meta property="og:title" content="Tapestry Vertical Gardens" />
        <meta property="og:description" content="Plant-first living walls, grown in our Devon nursery and installed across the UK." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="./images/carousel/1.webp" />
      </Head>

      <div className="landing-page" onClick={handleClick}>
        {/* Single background image with fade transition */}
        <div
          className={`landing-bg ${fadeClass}`}
          style={{
            backgroundImage: `url('/images/carousel/${currentImage}.webp')`
          }}
        />

        <div className="landing-content">
          <h1 className="landing-title">TAPESTRY</h1>
        </div>
      </div>
    </>
  );
}
