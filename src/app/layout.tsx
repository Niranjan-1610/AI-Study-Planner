import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CryptoPolyfill from "@/components/crypto-polyfill";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}
      >
        <CryptoPolyfill />
        {children}
      </body>
    </html>
  );
}
