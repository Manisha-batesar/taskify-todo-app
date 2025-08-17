import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { TaskProvider } from "@/context/TaskContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taskifyes.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taskify - From Plan To Done | Professional Task Management",
    template: "%s | Taskify - Task Management App"
  },
  description: "Transform your productivity with Taskify - the ultimate task management app. Organize projects, track deadlines, collaborate with teams, and achieve your goals efficiently. Start planning your success today!",
  keywords: [
    "task management",
    "productivity app",
    "project management",
    "todo list",
    "team collaboration",
    "deadline tracking",
    "goal management",
    "work organization",
    "productivity tools",
    "task planner",
    "project planner",
    "team productivity"
  ],
  authors: [{ name: "Taskify Team" }],
  creator: "Taskify",
  publisher: "Taskify",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Taskify",
    title: "Taskify - From Plan To Done | Professional Task Management",
    description: "Transform your productivity with Taskify - the ultimate task management app. Organize projects, track deadlines, collaborate with teams, and achieve your goals efficiently.",
    images: [
      {
        url: "/tsakify-preview.png",
        width: 1200,
        height: 630,
        alt: "Taskify - Professional Task Management App",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@taskifyes",
    creator: "@Manishabatesar",
    title: "Taskify - From Plan To Done | Professional Task Management",
    description: "Transform your productivity with Taskify - the ultimate task management app. Organize projects, track deadlines, and achieve your goals efficiently.",
    images: ["/tsakify-preview.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "productivity",
  classification: "Business & Productivity",
  generator: "Next.js",
  applicationName: "Taskify",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Taskify",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Task Management",
    "description": "Transform your productivity with Taskify - the ultimate task management app. Organize projects, track deadlines, collaborate with teams, and achieve your goals efficiently.",
    "url": siteUrl,
    "image": `${siteUrl}/tsakify-preview.png`,
    "screenshot": `${siteUrl}/tsakify-preview.png`,
    "logo": `${siteUrl}/taskify-logo.png`,
    "operatingSystem": "Web Browser, iOS, Android",
    "browserRequirements": "HTML5, CSS3, JavaScript",
    "softwareVersion": "1.0.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "category": "Free"
    },
    "featureList": [
      "Task Management",
      "Project Organization",
      "Team Collaboration",
      "Deadline Tracking",
      "Progress Monitoring",
      "Multi-platform Sync",
      "Custom Categories",
      "Real-time Updates"
    ],
    "author": {
      "@type": "Organization",
      "name": "Taskify Team",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Taskify",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/taskify-logo.png`
      }
    },
    "dateCreated": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Taskify" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="font-sans">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          themes={['light', 'dark', 'system']}
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
