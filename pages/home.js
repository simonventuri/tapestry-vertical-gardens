
import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Home() {
  const faqs = [
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
  ];
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }) }} />
    </Head>

    <Nav />

    {/* Hero Section */}
    <section className="hero">
      <div className="container">
        <h1>Vertical Gardens</h1>
        <h2>Fresh, sustainable, and grown in Devon</h2>
        <p className="lead">
          Our living walls bring freshness, texture, and vitality to any space — transforming the ordinary into a thriving, sustainable environment. Designed to evolve with the seasons, these biodiverse vertical gardens arrive ready to flourish.
        </p>
        <div>
          <a className="btn btn-large" href="/contact">Start Your Project</a>
        </div>
        <div className="hero-image">
          <img src="./images/home_page.jpg" alt="Tapestry Vertical Gardens - Lombolle Road Garden Installation" />
        </div>
      </div>
    </section>

    {/* Why Vertical Gardens Section */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2>Vertical Gardens: Beauty with Purpose</h2>
          <p className="section-subtitle">
            As cities grow ever denser, green space becomes increasingly precious. Vertical gardens transform overlooked walls into thriving ecosystems that support biodiversity, improve air quality, and create calming, restorative spaces — bringing nature back into the heart of urban life.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Air Purification</h3>
            <p>Living walls naturally filter air pollutants and increase oxygen levels, creating healthier indoor and outdoor environments.</p>
          </div>
          <div className="card">
            <h3>Climate Control</h3>
            <p>Vertical gardens provide natural insulation, reducing energy costs by moderating temperature and humidity levels.</p>
          </div>
          <div className="card">
            <h3>Biodiversity</h3>
            <p>Attract pollinators and create micro-ecosystems that support local wildlife while enhancing urban biodiversity.</p>
          </div>
          <div className="card">
            <h3>Wellbeing</h3>
            <p>Biophilic design reduces stress, boosts mood, and improves cognitive function through connection with nature.</p>
          </div>
          <div className="card">
            <h3>Sound Reduction</h3>
            <p>Natural sound barriers that absorb noise pollution, creating quieter, more peaceful environments.</p>
          </div>
          <div className="card">
            <h3>Visual Impact</h3>
            <p>Transform bland walls into stunning focal points that add beauty, texture, and life to any space.</p>
          </div>
        </div>
      </div>
    </section>

    {/* The Tapestry Difference */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2>The Tapestry Difference</h2>
          <p className="section-subtitle">
            We transform walls into dynamic, living installations built to thrive and inspire for years.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Plants First,<br />Hardware Second</h3>
            <p>
              Many systems force plants to fit the hardware. We do the opposite. We start with the planting plan —
              light levels, exposure, texture, colour, seasonality — and build the system around it. The result is
              a living tapestry that looks natural and stays healthy.
            </p>
          </div>

          <div className="card">
            <h3>Devon Nursery Advantage</h3>
            <p>
              Every garden is assembled and matured in our Devon nursery. We deliver established planting for
              immediate impact and minimal disruption on site. Your vertical garden arrives ready to impress.
            </p>
          </div>

          <div className="card">
            <h3>Hydroponic Precision</h3>
            <p>
              Our proprietary hydroponic approach delivers water and nutrients precisely where they are needed.
              Optional automation keeps maintenance low and reliability high, ensuring long-term success.
            </p>
          </div>

        </div>

        <div className="container">
          <h2 style={{ marginTop: '4rem' }}>Living Sculpture</h2>
          <p style={{ textAlign: 'center' }}>
            We create more than flat walls. Living spheres, columns, and chandeliers transform greenery into
            sculpture. These installations become centrepieces for homes, offices, and events.
          </p>
          <div className="hero-image" style={{ textAlign: 'center' }}>
            <img src="./images/bio-sphere-living-sculpture.jpg" alt="Tapestry Vertical Gardens - Bio Sphere" />
          </div>
        </div>
      </div>
    </section>

    {/* FAQs Section */}
    <section className="section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
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
