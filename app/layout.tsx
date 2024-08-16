import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { ToastContainer } from 'react-toastify'
import { Analytics } from "@vercel/analytics/react"
import { LoadingProvider } from '@/components/contexts/LoadingContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'A brief description of your application',
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
              <ToastContainer position="top-right" autoClose={5000} />
              <Toaster />
              {children}
            </main>
            <Analytics />
          </body>
        </html>
      </LoadingProvider>
    </SessionProvider>
  )
}