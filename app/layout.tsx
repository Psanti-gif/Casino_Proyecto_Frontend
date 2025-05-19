import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CUADRE CASINO',
  description: 'Sistema de gestión de casinos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6">
                {children}
                <Toaster />
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}