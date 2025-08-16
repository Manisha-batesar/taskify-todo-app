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

export const metadata: Metadata = {
  title: "Taskify - From Plan To Done",
  description: "Professional task management application",
  generator: "taskify.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
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
