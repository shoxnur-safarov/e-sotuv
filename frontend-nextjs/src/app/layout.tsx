import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Sotuv | Premium Electronics",
  description: "Uzbekiston'ning eng yaxshi elektron do'koni",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {    
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--background)] text-[var(--text)] min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}