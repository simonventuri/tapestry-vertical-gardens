
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Home() {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Tapestry Vertical Gardens", "image": "https://www.tapestryverticalgardens.com/images/hero-vertical-gardens-uk.jpg", "address": { "@type": "PostalAddress", "streetAddress": "[ADD STREET ADDRESS]", "addressLocality": "Devon", "addressRegion": "[ADD COUNTY]", "postalCode": "[ADD POSTCODE]", "addressCountry": "GB" }, "telephone": "[ADD PHONE NUMBER]", "areaServed": "GB", "url": "https://www.tapestryverticalgardens.com/" }) }} />
    </Head>

    <Nav />

    {/* Hero Section */}
    <section className="hero">
      <div className="container">
        <div className="subtitle">Vertical Gardens • Living Walls</div>
        <h1>Vertical Gardens: The Future of Green Architecture</h1>
        <p className="lead">
          Vertical gardens bring texture, freshness, and vitality to spaces that would otherwise be flat and grey.
          We design, grow, install, and maintain living walls across the UK — each one nurtured in our Devon nursery
          and delivered ready to thrive.
        </p>
        <div>
          <a className="btn btn-large" href="/contact">Start Your Project</a>
        </div>
        <div className="hero-image">
          <img src="./images/hero-vertical-gardens-uk.jpg" alt="Vertical gardens UK - lush living wall feature" />
        </div>
      </div>
    </section>

    {/* Why Vertical Gardens Section */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Vertical Gardens Are More Than Green Décor</h2>
          <p className="section-subtitle">
            In cities, space is scarce. Gardens compete with paving, car parks, and glass. A vertical garden flips the equation,
            turning unused walls into living ecosystems.
          </p>
        </div>

        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Air Purification</h3>
            <p>Living walls naturally filter air pollutants and increase oxygen levels, creating healthier indoor and outdoor environments.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌡️</div>
            <h3>Climate Control</h3>
            <p>Vertical gardens provide natural insulation, reducing energy costs by moderating temperature and humidity levels.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🦋</div>
            <h3>Biodiversity</h3>
            <p>Attract pollinators and create micro-ecosystems that support local wildlife while enhancing urban biodiversity.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Wellbeing</h3>
            <p>Biophilic design reduces stress, boosts mood, and improves cognitive function through connection with nature.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔇</div>
            <h3>Sound Reduction</h3>
            <p>Natural sound barriers that absorb noise pollution, creating quieter, more peaceful environments.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
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
          <h2 className="section-title">The Tapestry Difference</h2>
          <p className="section-subtitle">
            We don't just install plants on walls. We create living masterpieces that thrive for years to come.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Plants First, Hardware Second</h3>
            <p>
              Many systems force plants to fit the hardware. We do the opposite. We start with the planting plan —
              light levels, exposure, texture, colour, seasonality — and build the system around it. The result is
              a tapestry that looks natural and stays healthy.
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

          <div className="card">
            <h3>Beyond 2D: Living Sculpture</h3>
            <p>
              We create more than flat walls. Living spheres, columns, and chandeliers transform greenery into
              sculpture. These installations become centrepieces for homes, offices, and events.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* What We Create */}
    <section className="content-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What We Create</h2>
        </div>

        <ul className="inline">
          <li>Living Walls</li>
          <li>Indoor Features</li>
          <li>Outdoor Façades</li>
          <li>Green Columns</li>
          <li>Bio Spheres</li>
          <li>Chandeliers</li>
          <li>Custom Installations</li>
          <li>Maintenance Services</li>
        </ul>

        <div className="text-center mt-4">
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Explore the <a href="/portfolio">portfolio</a>, learn the <a href="/benefits">benefits</a>, or browse our <a href="/faqs">FAQs</a>.
          </p>
          <a href="/contact" className="btn btn-large">Tell Us About Your Space</a>
        </div>
      </div>
    </section>

    <Footer />
  </>)
}
