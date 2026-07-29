import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/components/config-provider";
import { WhatsAppModalProvider } from "@/components/whatsapp-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bringgiftcard.com"),
  title: "Bring Gift Card — Premium Global Gift Card & Crypto Trading",
  description:
    "Exchange Steam, Apple, Amazon, Visa, Xbox gift cards and cryptocurrencies with guaranteed best market rates, zero hidden charges, and instant money transfers globally.",
  keywords: [
    "gift card trading",
    "sell gift cards",
    "crypto exchange",
    "Steam gift card",
    "Apple gift card",
    "USDT",
    "Bitcoin",
    "money transfer",
    "Bring Gift Card",
  ],
  authors: [{ name: "Bring Gift Card" }],
  openGraph: {
    title: "Bring Gift Card — Premium Global Trading",
    description:
      "Instant liquidity for all major gift cards, crypto, and global money transfers. 24/7. Best rates guaranteed.",
    type: "website",
    siteName: "Bring Gift Card",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bring Gift Card — Premium Global Trading",
    description:
      "Instant liquidity for all major gift cards, crypto, and global money transfers. 24/7.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060913",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Ambient backgrounds */}
        <div className="page-bg" aria-hidden />
        <div className="page-grid" aria-hidden />

        <ConfigProvider>
          <WhatsAppModalProvider>{children}</WhatsAppModalProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
