import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Landing() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/');
    };

    return (
        <>
            <Head>
                <title>Tapestry</title>
                <meta name="description" content="Designed, grown in Devon, and installed across the UK." />
                <meta property="og:title" content="Tapestry" />
                <meta property="og:description" content="Plant-first design, grown in our Devon nursery and installed across the UK." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="./images/carousel/full+height+WEB.webp" />
            </Head>

            <div className="landing-page" onClick={handleClick}>
                <div className="landing-content">
                    <h1 className="landing-title">TAPESTRY</h1>
                </div>
            </div>
        </>
    );
}
