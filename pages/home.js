import { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Home({ initialContent }) {
  const [content, setContent] = useState(initialContent);

  // Load content from API on client-side if not provided by SSR
  useEffect(() => {
    if (!content) {
      fetch('/api/content')
        .then(res => res.json())
        .then(data => setContent(data))
        .catch(err => console.error('Error loading content:', err));
    }
  }, [content]);

  // Return loading state if no content
  if (!content) {
    return (
      <>
        <Head>
          <title>Vertical Gardens UK | Living Walls & Green Spaces — Tapestry Vertical Gardens</title>
        </Head>
        <Nav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (<>
    <Head>
      <title>Vertical Gardens UK | Living Walls & Green Spaces — Tapestry Vertical Gardens</title>
      <meta name="description" content="Vertical gardens and living walls designed, grown in Devon, and installed across the UK. Plant-first design, hydroponics, and living sculpture." />
      <meta property="og:title" content="Vertical Gardens UK | Living Walls & Green Spaces — Tapestry Vertical Gardens" />
      <meta property="og:description" content="Plant-first living walls, grown in our Devon nursery and installed across the UK." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="./images/hero-vertical-gardens-uk.jpg" />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", "name": "Tapestry Vertical Gardens", "url": "https://www.tapestryverticalgardens.com/", "logo": "https://www.tapestryverticalgardens.com/images/logo.jpg", "sameAs": [] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Tapestry Vertical Gardens", "image": "https://www.tapestryverticalgardens.com/images/hero-vertical-gardens-uk.jpg", "address": { "@type": "PostalAddress", "streetAddress": "Greenslade Nursery, Greenslade Road", "addressLocality": "Devon", "addressRegion": "GB", "postalCode": "TQ9 7BP", "addressCountry": "GB" }, "telephone": "07875 203901", "areaServed": "GB", "url": "https://www.tapestryverticalgardens.com/" }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": content.faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }) }} />
    </Head>

    <Nav />

    {/* Hero Section */}
    <section className="hero">
      <div className="container">
        <h1>{content.hero.title}</h1>
        <h2>{content.hero.subtitle}</h2>
        <p className="lead">
          {content.hero.description}
        </p>
        <div>
          <a className="btn btn-large" href={content.hero.ctaLink}>{content.hero.ctaText}</a>
        </div>
        <div className="hero-image">
          <img src={content.hero.image} alt={content.hero.imageAlt} />
        </div>
      </div>
    </section>

    {/* Why Vertical Gardens Section */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2>{content.whyVerticalGardens.title}</h2>
          <p className="section-subtitle">
            {content.whyVerticalGardens.subtitle}
          </p>
        </div>

        <div className="grid grid-2">
          {content.whyVerticalGardens.benefits.map((benefit, index) => (
            <div key={index} className="card">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* The Tapestry Difference */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2>{content.tapestryDifference.title}</h2>
          <p className="section-subtitle">
            {content.tapestryDifference.subtitle}
          </p>
        </div>

        <div className="grid grid-2">
          {content.tapestryDifference.features.map((feature, index) => (
            <div key={index} className="card">
              <h3 dangerouslySetInnerHTML={{ __html: feature.title }}></h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="container">
          <h2 style={{ marginTop: '4rem' }}>{content.livingSculpture.title}</h2>
          <p style={{ textAlign: 'center' }}>
            {content.livingSculpture.description}
          </p>
          <div className="hero-image" style={{ textAlign: 'center' }}>
            <img src={content.livingSculpture.image} alt={content.livingSculpture.imageAlt} />
          </div>
        </div>
      </div>
    </section>

    {/* FAQs Section */}
    <section className="section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {content.faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <p>Still have questions? <a href="./contact">Get in touch</a>.</p>
        </div>
      </div>
    </section>

    <Footer />
  </>)
}

// Use getServerSideProps to fetch content at request time
export async function getServerSideProps() {
  try {
    // Try to fetch content from our API
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/content`;

    const response = await fetch(apiUrl);
    const content = await response.json();

    return {
      props: {
        initialContent: content
      }
    };
  } catch (error) {
    console.error('Error fetching content in getServerSideProps:', error);

    // Return default content if API fails
    const defaultContent = {
      hero: {
        title: "Vertical Gardens",
        subtitle: "Vibrant, sustainable, and grown in Devon",
        description: "Our living walls bring colour, texture, and vitality to any space — transforming the ordinary into a thriving, sustainable environment. Designed to evolve with the seasons, these biodiverse vertical gardens arrive ready to flourish.",
        ctaText: "Start Your Project",
        ctaLink: "/contact",
        image: "./images/home_page.jpg",
        imageAlt: "Tapestry Vertical Gardens - Lombolle Road Garden Installation"
      },
      whyVerticalGardens: {
        title: "Vertical Gardens: Beauty with Purpose",
        subtitle: "As cities grow ever denser, green space becomes increasingly precious. Vertical gardens transform barren walls into thriving ecosystems that support biodiversity, improve air quality, and create calming, restorative spaces — bringing nature back into the heart of urban life.",
        benefits: [
          {
            title: "Air Purification",
            description: "Living walls naturally filter air pollutants and increase oxygen levels, creating healthier indoor and outdoor environments."
          },
          {
            title: "Climate Control",
            description: "Vertical gardens provide natural insulation, reducing energy costs by moderating temperature and humidity levels."
          },
          {
            title: "Biodiversity",
            description: "Attract pollinators and create micro-ecosystems that support local wildlife while enhancing urban biodiversity."
          },
          {
            title: "Wellbeing",
            description: "Biophilic design reduces stress, boosts mood, and improves cognitive function through connection with nature."
          },
          {
            title: "Sound Reduction",
            description: "Natural sound barriers that absorb noise pollution, creating quieter, more peaceful environments."
          },
          {
            title: "Visual Impact",
            description: "Transform bland walls into stunning focal points that add beauty, texture, and life to any space."
          }
        ]
      },
      tapestryDifference: {
        title: "The Tapestry Difference",
        subtitle: "We transform walls into dynamic, living installations built to thrive and inspire for years.",
        features: [
          {
            title: "Plants First,<br />Hardware Second",
            description: "Many systems force plants to fit the hardware. We do the opposite. We start with the planting plan — light levels, exposure, texture, colour, seasonality — and build the system around it. The result is a living tapestry that looks natural and stays healthy."
          },
          {
            title: "Fuss-free",
            description: "Every garden is planted by hand and matured in our Devon nursery. We install established planting for immediate impact. Your vertical garden arrives ready to impress with minimal disruption on site — an average installation takes only 2 - 3 days."
          },
          {
            title: "Hydroponic Precision",
            description: "Our proprietary hydroponic approach delivers water and nutrients precisely where they are needed. Optional automation keeps maintenance low and reliability high, ensuring long-term success."
          }
        ]
      },
      livingSculpture: {
        title: "Living Sculpture",
        description: "We create more than flat walls. Living spheres, columns, and chandeliers transform greenery into sculpture. These installations become centrepieces for homes, offices, and events.",
        image: "./images/bio-sphere-living-sculpture.jpg",
        imageAlt: "Tapestry Vertical Gardens - Bio Sphere"
      },
      faqs: [
        {
          question: "How long does a vertical garden last?",
          answer: "With proper care and seasonal maintenance, your living wall can thrive for decades and mature beautifully over time."
        },
        {
          question: "Do vertical gardens require much maintenance?",
          answer: "Our hydroponic systems deliver efficient water and nutrients. We offer maintenance packages covering pruning, checks, and replanting where needed."
        },
        {
          question: "Can I have a vertical garden indoors?",
          answer: "Yes. Our clean, soil-free systems suit interiors. We can add lighting where natural light is limited."
        },
        {
          question: "How much does a vertical garden cost?",
          answer: "Costs depend on size, design, and plant selection. We provide a clear quotation after consultation."
        },
        {
          question: "How long does installation take?",
          answer: "Because we pre-grow in our Devon nursery, many projects install in days with immediate impact."
        },
        {
          question: "What if some plants fail?",
          answer: "As with any garden, occasional replacement is normal. Maintenance plans keep displays looking perfect."
        }
      ]
    };

    return {
      props: {
        initialContent: defaultContent
      }
    };
  }
}
