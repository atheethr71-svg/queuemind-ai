import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { AuthProvider } from "@/contexts/AuthContext"
import { DemoProvider } from "@/contexts/DemoContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QueueMind AI - Smart Queue Monitoring & Predictive Management System",
  description:
    "Next-generation AI-driven queue management, real-time crowd estimation, predictive wait calculations, and autonomous operational decision support.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 antialiased selection:bg-indigo-500 selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DemoProvider>
              {children}
            </DemoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
