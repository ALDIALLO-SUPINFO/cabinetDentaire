import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation/Navigation'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DrKane - Gestion de Cabinet Médical',
  description: 'Application de gestion de cabinet médical',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navigation />
        <main className="pb-16 sm:pb-0">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
