import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { ToastContainer } from 'react-toastify'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { LoadingProvider } from '@/components/contexts/LoadingContext'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIEDRA- STONE BANK | Secure Crypto Exchange',
  description: 'PIEDRA-X is a secure and user-friendly platform for buying, selling, and exchanging cryptocurrencies. Manage your digital assets with ease, including BTC, ETH, and USDT.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <SessionProvider session={session}>
            <LoadingProvider>
              <div className="flex flex-col min-h-screen bg-background text-foreground">
                <main className="flex-grow">
                  {children}
                  <Toaster />
                </main>
                <Analytics />
                <SpeedInsights/>
              </div>
            </LoadingProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}