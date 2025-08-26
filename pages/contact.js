import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact — Tapestry Vertical Gardens</title>
                <meta name="description" content="Get in touch with Tapestry Vertical Gardens. Meet Adam Shepherd and our plant-first approach to living walls, grown in Devon and installed across the UK." />
                <link rel="canonical" href="https://www.tapestryverticalgardens.com/contact" />
                <meta property="og:image" content="./images/devon-nursery-vertical-gardens.jpg" />
            </Head>
            <Nav />

            {/* Header Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">Meet Tapestry Vertical Gardens</h1>
                        <p className="section-subtitle">Design artistry meets horticultural precision.</p>
                        <p><strong>Founded by Adam Shepherd</strong> — a graphic designer turned horticulturalist trained at The English Gardening School in Chelsea — Tapestry blends two decades of design with deep plant knowledge.</p>

                        <div className="adam-portrait">
                            <img src="./images/adam-portrait.webp" alt="Adam Shepherd, founder of Tapestry Vertical Gardens" />
                        </div>
                        &nbsp;
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-subtitle">Ready to transform your space with a living wall? Let's discuss your vision.</p>
                        <div className="contact-form-container">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputName" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="exampleInputName" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="exampleInputEmail" aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleMessage" className="form-label">Tell us about your project</label>
                                    <textarea className="form-control" id="exampleMessage" rows="5"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}