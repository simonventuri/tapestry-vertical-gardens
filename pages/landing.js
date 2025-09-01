import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Landing() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/');
    };

    const titleStyle = {
        fontSize: '48px',
        fontWeight: '800',
        letterSpacing: '0.3em',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        margin: '0 0 1rem 0',
        fontVariant: 'normal',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        lineHeight: '1',
        textAlign: 'center'
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
                    <div style={titleStyle}>TAPESTRY</div>
                </div>
            </div>
        </>
    );
}
