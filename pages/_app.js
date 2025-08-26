
import '../styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}
