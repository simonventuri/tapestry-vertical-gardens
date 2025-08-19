
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Portfolio(){
  return (<>
    <Head>
      <title>Portfolio — Living Walls & Vertical Garden Projects</title>
      <meta name="description" content="See living wall and sculptural vertical garden projects across the UK, including Eaton Square, Belsize Avenue, Kings Road, and the Bio Sphere." />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/portfolio" />
    </Head>
    <Nav />
    <div dangerouslySetInnerHTML={{__html: "\n<div class='container prose'>\n  <h1 class='section-title'>Living Walls That Transform Spaces</h1>\n  <p class='section-sub'>A selection of projects that show how vertical gardens humanise architecture.</p>\n\n  <h2>Eaton Square \u2014 Urban Luxury Reimagined</h2>\n  <img src='/images/eaton-square-vertical-garden-london.png' alt='Eaton Square vertical garden in London - evergreen living wall' />\n  <p>In the heart of London, residents sought greenery to soften a refined courtyard. We composed an evergreen structure woven with seasonal highlights for year-round presence. Delivered fully established from our nursery, the wall changed the mood of the space overnight.</p>\n\n  <h2>Belsize Avenue \u2014 Residential Charm Meets Living Art</h2>\n  <img src='/images/belsize-avenue-living-wall-london.png' alt='Belsize Avenue living wall in London - grasses and perennials' />\n  <p>A home feature that evolves with the seasons: fresh greens and blossoms in spring, rich abundance in summer, warm tones in autumn. A conversation piece that connects daily life with the rhythm of nature.</p>\n\n  <h2>Kings Road \u2014 Commercial Green Statement</h2>\n  <img src='/images/kings-road-living-wall-commercial.png' alt='Kings Road commercial living wall - sustainable facade' />\n  <p>For a high-footfall retail street, we created a fa\u00e7ade that communicates freshness, creativity, and care for the environment. Customers notice. Employees feel the difference.</p>\n\n  <h2>Bio Sphere \u2014 A Vision of the Future</h2>\n  <img src='/images/bio-sphere-living-sculpture.png' alt='Bio Sphere living sculpture - free-standing hydroponic sphere' />\n  <p>A free-standing orb wrapped in living plants. Part sculpture, part garden, all theatre. Ideal for exhibitions, atria, and events that want a centrepiece with life.</p>\n\n  <p>See how living walls can elevate your site \u2014 <a href='/contact'>book a consultation</a>.</p>\n</div>\n" }} />
    <Footer />
  </>)
}
