import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Tapestry Vertical Gardens</title>
                <meta name="description" content="Privacy Policy for Tapestry Vertical Gardens - How we collect, use, and protect your personal data." />
            </Head>

            <Nav />

            <section className="privacy-policy">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h1>Privacy Policy</h1>
                            <p className="last-updated">Last updated: September 2, 2025</p>

                            <div className="policy-content">
                                <h2>1. Information We Collect</h2>
                                <p>When you contact us through our website, we collect:</p>
                                <ul>
                                    <li>Your name</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Project details and messages you send us</li>
                                    <li>Location information (for project planning)</li>
                                    <li>Budget preferences</li>
                                </ul>

                                <h2>2. How We Use Your Information</h2>
                                <p>We use your personal information to:</p>
                                <ul>
                                    <li>Respond to your enquiries about our services</li>
                                    <li>Provide project quotes and consultations</li>
                                    <li>Communicate about your vertical garden project</li>
                                    <li>Improve our services</li>
                                </ul>

                                <h2>3. Legal Basis for Processing</h2>
                                <p>We process your personal data based on:</p>
                                <ul>
                                    <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for responding to your enquiry</li>
                                    <li><strong>Legitimate interests:</strong> Processing is necessary for our legitimate business interests in providing garden design services</li>
                                </ul>

                                <h2>4. Data Retention</h2>
                                <p>We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, typically:</p>
                                <ul>
                                    <li>Active enquiries: Until project completion or enquiry is closed</li>
                                    <li>Completed projects: Up to 7 years for warranty and legal purposes</li>
                                    <li>Inactive enquiries: Up to 2 years, then deleted</li>
                                </ul>

                                <h2>5. Data Sharing</h2>
                                <p>We do not sell, trade, or share your personal information with third parties except:</p>
                                <ul>
                                    <li>With trusted service providers who help us operate our business (subject to confidentiality agreements)</li>
                                    <li>When required by law or to protect our rights</li>
                                </ul>

                                <h2>6. Your Rights</h2>
                                <p>Under GDPR, you have the right to:</p>
                                <ul>
                                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                                    <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                                    <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                    <li><strong>Object:</strong> Object to processing of your personal data</li>
                                    <li><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
                                </ul>

                                <h2>7. Data Security</h2>
                                <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                                <h2>8. Cookies and Tracking</h2>
                                <p>We use cookies and similar technologies to enhance your experience on our website:</p>
                                
                                <h3>Essential Cookies</h3>
                                <p>These cookies are necessary for the website to function properly and cannot be disabled:</p>
                                <ul>
                                    <li>Session cookies for contact form functionality</li>
                                    <li>Security cookies for admin authentication</li>
                                    <li>Preference cookies to remember your cookie choices</li>
                                </ul>

                                <h3>Analytics Cookies</h3>
                                <p>With your consent, we use Google Analytics to understand how visitors use our website:</p>
                                <ul>
                                    <li>Google Analytics cookies (_ga, _ga_*, _gid) - track website usage and performance</li>
                                    <li>These help us improve our website and services</li>
                                    <li>Data is anonymized and aggregated</li>
                                </ul>

                                <h3>Managing Your Cookie Preferences</h3>
                                <p>You can:</p>
                                <ul>
                                    <li>Use our cookie banner to accept or decline analytics cookies</li>
                                    <li>Change your preferences using the "Cookie Settings" button</li>
                                    <li>Disable cookies in your browser settings (may affect site functionality)</li>
                                    <li>Opt out of Google Analytics using their <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">opt-out tool</a></li>
                                </ul>

                                <h2>9. Contact Us</h2>
                                <p>For any questions about this privacy policy or to exercise your rights, please contact us:</p>
                                <ul>
                                    <li>Email: info@tapestryverticalgardens.com</li>
                                    <li>Phone: 07875 203901</li>
                                    <li>Address: Greenslade Nursery, Greenslade Road, Blackawton, Totnes, Devon, TQ9 7BP</li>
                                </ul>

                                <h2>10. Changes to This Policy</h2>
                                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated "last modified" date.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .privacy-policy {
                    background-color: #ffffff;
                    padding: 80px 0;
                    min-height: 100vh;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                h1 {
                    color: #2d5016;
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                .last-updated {
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 30px;
                    font-style: italic;
                }

                .policy-content h2 {
                    color: #2d5016;
                    font-size: 1.5rem;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    font-weight: 500;
                }

                .policy-content p {
                    color: #333;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }

                .policy-content ul {
                    margin-bottom: 20px;
                    padding-left: 20px;
                }

                .policy-content li {
                    color: #333;
                    line-height: 1.6;
                    margin-bottom: 8px;
                }

                strong {
                    color: #2d5016;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .privacy-policy {
                        padding: 60px 0;
                    }

                    h1 {
                        font-size: 2rem;
                    }

                    .policy-content h2 {
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </>
    );
}
