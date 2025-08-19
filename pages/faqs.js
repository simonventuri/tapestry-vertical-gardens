
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function FAQs() {
  return (<>
    <Head>
      <title>Vertical Gardens FAQs — Costs, Maintenance & Installation</title>
      <meta name="description" content="Answers to common questions about living walls: lifespan, maintenance, indoor suitability, costs and timelines." />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/faqs" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{ "@type": "Question", "name": "How long does a vertical garden last?", "acceptedAnswer": { "@type": "Answer", "text": "With proper care and seasonal maintenance, your living wall can thrive for decades and mature beautifully over time." } }, { "@type": "Question", "name": "Do vertical gardens require much maintenance?", "acceptedAnswer": { "@type": "Answer", "text": "Our hydroponic systems deliver efficient water and nutrients. We offer maintenance packages covering pruning, checks and replanting where needed." } }, { "@type": "Question", "name": "Can I have a vertical garden indoors?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our clean, soil-free systems suit interiors. We can add lighting where natural light is limited." } }, { "@type": "Question", "name": "How much does a vertical garden cost?", "acceptedAnswer": { "@type": "Answer", "text": "Costs depend on size, design and plant selection. We provide a clear quotation after consultation." } }, { "@type": "Question", "name": "How long does installation take?", "acceptedAnswer": { "@type": "Answer", "text": "Because we pre-grow in our Devon nursery, many projects install in days with immediate impact." } }, { "@type": "Question", "name": "What if some plants fail?", "acceptedAnswer": { "@type": "Answer", "text": "As with any garden, occasional replacement is normal. Maintenance plans keep displays looking perfect." } }]
        })
      }} />
    </Head>
    <Nav />
    <div dangerouslySetInnerHTML={{ __html: "\n<div class='container prose'>\n  <h1 class='section-title'>Vertical Gardens \u2014 FAQs</h1>\n\n  <h3>How long does a vertical garden last?</h3>\n  <p>With proper care and seasonal maintenance, your living wall can thrive for decades and mature beautifully over time.</p>\n\n  <h3>Do vertical gardens require much maintenance?</h3>\n  <p>Our hydroponic systems deliver efficient water and nutrients. We offer maintenance packages covering pruning, checks, and replanting where needed.</p>\n\n  <h3>Can I have a vertical garden indoors?</h3>\n  <p>Yes. Our clean, soil-free systems suit interiors. We can add lighting where natural light is limited.</p>\n\n  <h3>How much does a vertical garden cost?</h3>\n  <p>Costs depend on size, design, and plant selection. We provide a clear quotation after consultation.</p>\n\n  <h3>How long does installation take?</h3>\n  <p>Because we pre-grow in our Devon nursery, many projects install in days with immediate impact.</p>\n\n  <h3>What if some plants fail?</h3>\n  <p>As with any garden, occasional replacement is normal. Maintenance plans keep displays looking perfect.</p>\n\n  <p>Still have questions? <a href='/contact'>Get in touch</a>.</p>\n</div>\n" }} />
    <Footer />
  </>)
}
