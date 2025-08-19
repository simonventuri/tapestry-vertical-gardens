
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function About(){
  return (<>
    <Head>
      <title>About — Tapestry Vertical Gardens</title>
      <meta name="description" content="Meet Adam Shepherd and our plant-first approach to living walls, spheres and sculptural greenery, grown in Devon and installed across the UK." />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/about" />
      <meta property="og:image" content="/images/devon-nursery-vertical-gardens.png" />
    </Head>
    <Nav />
    <div dangerouslySetInnerHTML={{__html: "\n<div class='container prose'>\n  <h1 class='section-title'>Meet Tapestry Vertical Gardens</h1>\n  <p class='section-sub'>Design artistry meets horticultural precision.</p>\n  <p><strong>Founded by Adam Shepherd</strong> \u2014 a graphic designer turned horticulturalist trained at The English Gardening School in Chelsea \u2014 Tapestry blends two decades of design with deep plant knowledge.</p>\n  <p>Adam personally oversees planting at the nursery and installation on site. Clients work directly with the designer, not a call centre, and every project carries his signature attention to detail.</p>\n\n  <h2>A Philosophy Rooted in Plants</h2>\n  <p>We begin with light, aspect, texture, and seasonal rhythm. Palettes are curated for compatibility as much as colour, so planting grows harmoniously over time. Herbs for fragrance, tropicals for lush interiors, pollinator-friendly species for biodiversity \u2014 each plan is bespoke.</p>\n\n  <h2>How We Work</h2>\n  <ol class='list'>\n    <li><strong>Consultation</strong> \u2014 share your goals, constraints, and style.</li>\n    <li><strong>Design and Plant Selection</strong> \u2014 a tailored planting plan for your conditions.</li>\n    <li><strong>Nursery Growth</strong> \u2014 panels or structures are assembled and matured in Devon.</li>\n    <li><strong>Installation</strong> \u2014 rapid, low-disruption delivery with immediate impact.</li>\n    <li><strong>Care</strong> \u2014 maintenance to keep your garden thriving for years.</li>\n  </ol>\n\n  <img src='/images/devon-nursery-vertical-gardens.png' alt='Devon nursery - pre-grown living wall panels ready for installation' />\n\n  <p>Ready to collaborate? <a href='/contact'>Get in touch</a> and tell us about your space.</p>\n</div>\n" }} />
    <Footer />
  </>)
}
