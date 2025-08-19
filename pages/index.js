
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Home(){
  return (<>
    <Head>
      <title>Vertical Gardens UK | Living Walls & Green Spaces — Tapestry Vertical Gardens</title>
      <meta name="description" content="Vertical gardens and living walls designed, grown in Devon, and installed across the UK. Plant-first design, hydroponics, and living sculpture." />
      <meta property="og:title" content="Vertical Gardens UK | Living Walls & Green Spaces — Tapestry Vertical Gardens" />
      <meta property="og:description" content="Plant-first living walls, grown in our Devon nursery and installed across the UK." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/images/hero-vertical-gardens-uk.png" />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context": "https://schema.org", "@type": "Organization", "name": "Tapestry Vertical Gardens", "url": "https://www.tapestryverticalgardens.com/", "logo": "https://www.tapestryverticalgardens.com/images/logo.png", "sameAs": []})}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context": "https://schema.org", "@type": "LocalBusiness", "name": "Tapestry Vertical Gardens", "image": "https://www.tapestryverticalgardens.com/images/hero-vertical-gardens-uk.png", "address": {"@type": "PostalAddress", "streetAddress": "[ADD STREET ADDRESS]", "addressLocality": "Devon", "addressRegion": "[ADD COUNTY]", "postalCode": "[ADD POSTCODE]", "addressCountry": "GB"}, "telephone": "[ADD PHONE NUMBER]", "areaServed": "GB", "url": "https://www.tapestryverticalgardens.com/"})}} />
    </Head>
    <Nav />
    <div dangerouslySetInnerHTML={{__html: "\n<section class='hero'>\n  <div class='container'>\n    <p class='small' style='letter-spacing:.15em;color:#166534;font-weight:700'>VERTICAL GARDENS \u2022 LIVING WALLS</p>\n    <h1>Vertical Gardens: The Future of Green Architecture</h1>\n    <p>Vertical gardens bring texture, freshness, and vitality to spaces that would otherwise be flat and grey. We design, grow, install, and maintain living walls across the UK \u2014 each one nurtured in our Devon nursery and delivered ready to thrive.</p>\n    <p><a class='btn' href='/contact'>Start Your Project</a></p>\n    <img src='/images/hero-vertical-gardens-uk.png' alt='Vertical gardens UK - lush living wall feature' />\n  </div>\n</section>\n\n<div class='container prose'>\n  <h2>Why Vertical Gardens Are More Than Green D\u00e9cor</h2>\n  <p>In cities, space is scarce. Gardens compete with paving, car parks, and glass. A vertical garden flips the equation, turning unused walls into living ecosystems. They beautify, clean the air, regulate temperature, soften sound, and attract pollinators. They also make people feel better \u2014 biophilic design reduces stress and boosts mood.</p>\n\n  <h2>The Tapestry Difference</h2>\n  <h3>Plants First, Hardware Second</h3>\n  <p>Many systems force plants to fit the hardware. We do the opposite. We start with the planting plan \u2014 light levels, exposure, texture, colour, seasonality \u2014 and build the system around it. The result is a tapestry that looks natural and stays healthy.</p>\n\n  <h3>Devon Nursery Advantage</h3>\n  <p>Every garden is assembled and matured in our Devon nursery. We deliver established planting for immediate impact and minimal disruption on site.</p>\n\n  <h3>Hydroponic Precision</h3>\n  <p>Our proprietary hydroponic approach delivers water and nutrients precisely where they are needed. Optional automation keeps maintenance low and reliability high.</p>\n\n  <h3>Beyond 2D: Living Sculpture</h3>\n  <p>We create more than flat walls. Living spheres, columns, and chandeliers transform greenery into sculpture. These installations become centrepieces for homes, offices, and events.</p>\n\n  <h2>What We Create</h2>\n  <ul class='inline'><li>Living walls</li><li>Indoor features</li><li>Outdoor fa\u00e7ades</li><li>Green columns</li><li>Bio spheres</li><li>Chandeliers</li></ul>\n\n  <p>Explore the <a href='/portfolio'>portfolio</a>, learn the <a href='/benefits'>benefits</a>, or browse our <a href='/faqs'>FAQs</a>. When you\u2019re ready, <a href='/contact'>tell us about your space</a>.</p>\n</div>\n" }} />
    <Footer />
  </>)
}
