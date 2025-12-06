import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
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
  title: "Conarte - Arte y Cultura",
  description: "Transformando espacios con arte y cultura",
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
