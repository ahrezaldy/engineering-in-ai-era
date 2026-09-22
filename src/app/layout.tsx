import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ReducedMotionGate } from "@/components/ui/ReducedMotionGate";
import { DECK } from "@/lib/deck-config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${DECK.title} — ${DECK.subtitle}`,
  description: DECK.description,
  // This deck is an internal talk. It must not be crawled or indexed.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: `${DECK.title} — ${DECK.subtitle}`,
    description: DECK.description,
    siteName: DECK.event,
    type: "website",
  },
  authors: [{ name: DECK.speaker }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      </head>
      <body className="antialiased">
        {/* Stage decks open dark regardless of the machine's setting; the toggle is the
            only thing that changes it, and the choice is remembered. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReducedMotionGate>{children}</ReducedMotionGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
