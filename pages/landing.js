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
                <title>Tapestry Vertical Gardens</title>
                <meta name="description" content="Vertical gardens and living walls designed, grown in Devon, and installed across the UK." />
                <meta property="og:title" content="Tapestry Vertical Gardens" />
                <meta property="og:description" content="Plant-first living walls, grown in our Devon nursery and installed across the UK." />
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
