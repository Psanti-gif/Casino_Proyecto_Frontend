import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CUADRE CASINO',
  description: 'Sistema de gestión de casinos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener configuración desde backend
  let config = {
    color_primario: '#1d4ed8',
    color_fondo: '#ffffff'
  }

  try {
    const res = await fetch('http://localhost:8000/configuracion', {
      cache: 'no-store',
    })
    const data = await res.json()
    config.color_primario = data.color_primario || '#1d4ed8'
    config.color_fondo = data.color_fondo || '#ffffff'
  } catch (error) {
    console.error("No se pudo cargar configuración de colores", error)
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        style={{
          backgroundColor: config.color_fondo,
          ['--color-primario' as any]: config.color_primario,
        }}
      >
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
