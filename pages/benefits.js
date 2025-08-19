
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Benefits() {
  return (<>
    <Head>
      <title>Benefits of Vertical Gardens — Clean Air, Comfort & Biodiversity</title>
      <meta name="description" content="Discover how vertical gardens improve air quality, reduce noise, boost energy efficiency and support wellbeing and biodiversity." />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/benefits" />
    </Head>
    <Nav />
    <div dangerouslySetInnerHTML={{ __html: "\n<div class='container prose'>\n  <h1 class='section-title'>The Power of Vertical Gardens</h1>\n  <p class='section-sub'>Beauty with benefits \u2014 indoors and out.</p>\n\n  <h2>Cleaner Air, Healthier Spaces</h2>\n  <p>Plants filter airborne pollutants and refresh the air. Indoors, this improves everyday wellbeing for residents, customers, and teams.</p>\n\n  <h2>Natural Sound Absorption</h2>\n  <p>Dense foliage absorbs and scatters sound. Vertical gardens reduce echo and create calmer, more private environments.</p>\n\n  <h2>Cooling and Energy Efficiency</h2>\n  <p>Green fa\u00e7ades shade buildings in summer and add insulation in winter. That\u2019s comfort and efficiency working together.</p>\n\n  <h2>Biodiversity in the City</h2>\n  <p>Considerate plant palettes support pollinators and urban wildlife, reconnecting buildings with nature.</p>\n\n  <h2>The Biophilic Effect</h2>\n  <p>People need nature. Biophilic design is proven to reduce stress and support creativity, focus, and mood.</p>\n\n  <p>Learn more in our <a href='/faqs'>FAQs</a> or <a href='/contact'>speak to the team</a>.</p>\n</div>\n" }} />
    <Footer />
  </>)
}
