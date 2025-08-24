import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <>
            <Nav />
            <div>
                <div className="container prose">
                    <h1 className="section-title">Contact</h1>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputName" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleMessage" className="form-label">Message</label>
                            <textarea className="form-control" id="exampleMessage" rows="5"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    )
}