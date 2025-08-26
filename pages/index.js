import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(1);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  // Precache all images, but start carousel after first image
  useEffect(() => {
    // Load first image immediately
    const firstImg = new Image();
    firstImg.src = `/images/carousel/1.webp`;
    firstImg.onload = () => {
      setFirstImageLoaded(true);
    };

    // Precache remaining images in background
    for (let i = 2; i <= 11; i++) {
      const img = new Image();
      img.src = `/images/carousel/${i}.webp`;
      // No need to track these - they'll load in background
    }
  }, []);

  useEffect(() => {
    if (!firstImageLoaded) return; // Don't start carousel until first image is loaded

    const interval = setInterval(() => {
      // Start fade out
      setFadeClass('fade-out');

      setTimeout(() => {
        // Change image during fade
        setCurrentImage(prev => prev >= 11 ? 1 : prev + 1);
        // Start fade in
        setFadeClass('fade-in');
      }, 50); // Extremely short transition time
      
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [firstImageLoaded]);

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

        {/* Loading indicator while first image loads */}
        {!firstImageLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="landing-content">
          <h1 className="landing-title">TAPESTRY</h1>
          <h2 className="landing-subtitle">Vertical Gardens : Living Walls</h2>
        </div>
      </div>
    </>
  );
}
