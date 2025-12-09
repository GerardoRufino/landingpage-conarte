import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "animate.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DevBreakpointIndicator from "../components/DevBreakpointIndicator";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Conarte - Construcción y Desarrollo Urbano",
  description: "Construcción y desarrollo urbano con excelencia, transparencia y competitividad en Puebla, México",
  authors: [{ name: "Conarte" }],
  creator: "Conarte",
  publisher: "Conarte",
  metadataBase: new URL('https://www.conarte.site'),
  alternates: {
    canonical: '/',
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Conarte - Construcción y Desarrollo Urbano",
    description: "Construcción y desarrollo urbano con excelencia, transparencia y competitividad",
    url: "https://www.conarte.site",
    siteName: "Conarte",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Conarte - Construcción y Desarrollo Urbano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conarte - Construcción y Desarrollo Urbano",
    description: "Construcción y desarrollo urbano con excelencia, transparencia y competitividad",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunitoSans.variable} antialiased flex flex-col min-h-screen font-sans`}
        style={{ fontFamily: 'var(--font-nunito-sans)' }}
      >
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MQN9GZFS');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQN9GZFS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
        <DevBreakpointIndicator />
      </body>
    </html>
  );
}
