import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact — Tapestry Vertical Gardens</title>
                <meta name="description" content="Get in touch with Tapestry Vertical Gardens for your vertical garden and living wall project." />
                <link rel="canonical" href="https://www.tapestryverticalgardens.com/contact" />

                {/* Bootstrap CSS */}
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr"
                    crossOrigin="anonymous"
                />

                {/* Bootstrap JS */}
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q"
                    crossOrigin="anonymous"
                ></script>
            </Head>
            <div>
                <Nav />
                <div>
                    <div class='container prose'>
                        <h1 class='section-title'>Contact</h1>
                        <form>
                            <div class="mb-3">
                                <label for="exampleInputName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="exampleInputName" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail" aria-describedby="emailHelp" />
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleMessage" class="form-label">Message</label>
                                <textarea class="form-control" id="exampleMessage" rows="5"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}