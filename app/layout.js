import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-cormorant',
})

export const metadata = {
  title: {
    default: 'Toro · Torino',
    template: '%s · Toro'
  },
  description: 'Il marketplace degli studenti di Torino. Trova studenti per ripetizioni, pulizie, aiuto con documenti consolari e molto altro.',
  keywords: ['studenti torino', 'ripetizioni torino', 'pulizie torino', 'lavoro studenti torino', 'marketplace torino', 'öğrenci hizmetleri torino'],
  authors: [{ name: 'Toro' }],
  creator: 'Toro',
  metadataBase: new URL('https://toro-peach.vercel.app'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Toro · Torino',
    description: 'Il marketplace degli studenti di Torino.',
    url: 'https://toro-peach.vercel.app',
    siteName: 'Toro',
    images: [
      {
        url: '/torino.jpeg',
        width: 1200,
        height: 630,
        alt: 'Toro - Il marketplace degli studenti di Torino',
      }
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toro · Torino',
    description: 'Il marketplace degli studenti di Torino.',
    images: ['/torino.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={cormorant.variable}>
      <body className="bg-[#FAFAF7] font-sans antialiased relative min-h-screen">
        {children}
      </body>
    </html>
  )
}