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
    <SessionProvider session={session}>
      <LoadingProvider>
        <html lang="en" className="h-full">
          <body className={`${inter.className} flex flex-col min-h-screen`}>
            <main className="flex-grow">
             
              
              {children}
              <Toaster />
            </main>
            <Analytics />
            <SpeedInsights/>
          </body>
        </html>
      </LoadingProvider>
    </SessionProvider>
  )
}