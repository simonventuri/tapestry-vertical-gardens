
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Portfolio() {
  const projects = [
    {
      title: "Eaton Square — Urban Luxury Reimagined",
      image: "./images/eaton-square-vertical-garden-london.jpg",
      alt: "Eaton Square vertical garden in London - evergreen living wall",
      description: "In the heart of London, residents sought greenery to soften a refined courtyard. We composed an evergreen structure woven with seasonal highlights for year-round presence. Delivered fully established from our nursery, the wall changed the mood of the space overnight."
    },
    {
      title: "Belsize Avenue — Residential Charm Meets Living Art",
      image: "./images/belsize-avenue-living-wall-london.jpg",
      alt: "Belsize Avenue living wall in London - grasses and perennials",
      description: "A home feature that evolves with the seasons: fresh greens and blossoms in spring, rich abundance in summer, warm tones in autumn. A conversation piece that connects daily life with the rhythm of nature."
    },
    {
      title: "Kings Road — Commercial Green Statement",
      image: "./images/kings-road-living-wall-commercial.jpg",
      alt: "Kings Road commercial living wall - sustainable facade",
      description: "For a high-footfall retail street, we created a façade that communicates freshness, creativity, and care for the environment. Customers notice. Employees feel the difference."
    },
    {
      title: "Bio Sphere — A Vision of the Future",
      image: "./images/bio-sphere-living-sculpture.jpg",
      alt: "Bio Sphere living sculpture - free-standing hydroponic sphere",
      description: "A free-standing orb wrapped in living plants. Part sculpture, part garden, all theatre. Ideal for exhibitions, atria, and events that want a centrepiece with life."
    }
  ];

  return (<>
    <Head>
      <title>Portfolio — Living Walls & Vertical Garden Projects</title>
      <meta name="description" content="See living wall and sculptural vertical garden projects across the UK, including Eaton Square, Belsize Avenue, Kings Road, and the Bio Sphere." />
      <link rel="canonical" href="https://www.tapestryverticalgardens.com/portfolio" />
    </Head>

    <Nav />

    <section className="section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Living Walls That Transform Spaces</h1>
          <p className="section-subtitle">
            A selection of projects that show how vertical gardens humanise architecture and bring life to urban environments.
          </p>
        </div>

        <div className="grid grid-2">
          {projects.map((project, index) => (
            <div key={index} className="card">
              <div className="card-image">
                <img src={project.image} alt={project.alt} />
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>

        {/* Image Gallery */}
        <div className="section-header mt-4">
          <h2 className="section-title">Project Gallery</h2>
        </div>

        <div className="image-gallery">
          <img src="./images/devon-nursery-vertical-gardens.jpg" alt="Devon nursery where vertical gardens are grown" />
          <img src="./images/eaton-square-vertical-garden-london.jpg" alt="Eaton Square vertical garden detail" />
          <img src="./images/belsize-avenue-living-wall-london.jpg" alt="Belsize Avenue living wall close-up" />
          <img src="./images/kings-road-living-wall-commercial.jpg" alt="Kings Road commercial installation" />
          <img src="./images/bio-sphere-living-sculpture.jpg" alt="Bio Sphere living sculpture detail" />
          <img src="./images/hero-vertical-gardens-uk.jpg" alt="Vertical garden showcase" />
        </div>

        <div className="text-center mt-4">
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            See how living walls can elevate your space and transform your environment.
          </p>
          <a href="/contact" className="btn btn-large">Book a Consultation</a>
        </div>
      </div>
    </section>

    <Footer />
  </>)
}
