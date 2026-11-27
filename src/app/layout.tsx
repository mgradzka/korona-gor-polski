import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

// Condensed caps for labels and numbers, like the small print on old maps and magazines
const condensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600"],
  subsets: ["latin", "latin-ext"],
});

const ui = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Korona Gór Polski",
  description:
    "Interaktywna mapa 28 szczytów Korony Gór Polski. Śledź swoje zdobyte szczyty i planuj kolejne wyjścia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${sans.variable} ${serif.variable} ${ui.variable} ${condensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
