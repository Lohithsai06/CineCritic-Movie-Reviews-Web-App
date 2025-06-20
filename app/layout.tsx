

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { MovieProvider } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CineCritic - Movie Reviews",
    template: "%s | CineCritic",
  },
  description: "Discover and review the latest movies on CineCritic",
  keywords: ["movies", "reviews", "ratings", "cinema", "films"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cinecritic.com",
    siteName: "CineCritic",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CineCritic - Movie Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineCritic - Movie Reviews",
    description: "Discover and review the latest movies on CineCritic",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-[#0a0d14]`}>
        <MovieProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </MovieProvider>
      </body>
    </html>
  );
}
