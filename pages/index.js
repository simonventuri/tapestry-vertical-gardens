import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(1);
  const [nextImage, setNextImage] = useState(2);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    // Preload all images before starting carousel
    const totalImages = 11;
    const imagePromises = [];

    for (let i = 1; i <= totalImages; i++) {
      const promise = new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Continue even if an image fails
        img.src = `/images/carousel/${i}.webp`;
      });
      imagePromises.push(promise);
    }

    // Wait for all images to load before starting carousel
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      const next = currentImage >= 11 ? 1 : currentImage + 1;

      // Set the next image in the background layer
      setNextImage(next);

      // Wait a tiny bit for the background to update, then crossfade
      setTimeout(() => {
        setShowFirst(!showFirst);
        setCurrentImage(next);
      }, 50);

    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [imagesLoaded, currentImage, showFirst]);

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
        {/* Two layered backgrounds for smooth crossfade */}
        <div
          className="landing-bg"
          style={{
            backgroundImage: `url('/images/carousel/${currentImage}.webp')`,
            opacity: showFirst ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            zIndex: showFirst ? 2 : 1
          }}
        />
        <div
          className="landing-bg"
          style={{
            backgroundImage: `url('/images/carousel/${nextImage}.webp')`,
            opacity: showFirst ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            zIndex: showFirst ? 1 : 2
          }}
        />

        {/* Loading overlay while images preload */}
        {!imagesLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="landing-content">
          <h1
            className="landing-title"
            style={{ fontSize: 'clamp(1.4rem, 2vw, 1.5rem)' }}
          >
            TAPESTRY
          </h1>
        </div>
      </div>
    </>
  );
}
