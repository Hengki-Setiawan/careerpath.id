import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerPath.id | Career Operating System untuk Gen Z",
  description: "Platform all-in-one untuk perencanaan karier, skill tracking, dan kesehatan mental. Dirancang khusus untuk Gen Z Indonesia.",
  keywords: ["karier", "career planning", "skill tracking", "mental health", "gen z", "makassar", "indonesia"],
  authors: [{ name: "CareerPath.id Team" }],
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareerPath.id",
  },
  openGraph: {
    title: "CareerPath.id | Career Operating System untuk Gen Z",
    description: "Platform all-in-one untuk perencanaan karier, skill tracking, dan kesehatan mental.",
    type: "website",
    locale: "id_ID",
    siteName: "CareerPath.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Skip to content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-br-lg"
        >
          Skip to main content
        </a>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <CookieConsent />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

