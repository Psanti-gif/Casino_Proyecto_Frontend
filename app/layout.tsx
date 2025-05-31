import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

// 👇 Importa directamente la página de mantenimiento
import MaintenancePage from './maintenance/page'

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
  let config = {
    color_primario: '#1d4ed8',
    color_fondo: '#ffffff',
    modo_mantenimiento: false
  }

  try {
    const res = await fetch('http://localhost:8000/configuracion', {
      cache: 'no-store',
    })
    const data = await res.json()
    config.color_primario = data.color_primario || '#1d4ed8'
    config.color_fondo = data.color_fondo || '#ffffff'
    config.modo_mantenimiento = data.modo_mantenimiento || false
  } catch (error) {
    console.error("No se pudo cargar configuración", error)
  }

  // ✅ Si está activado el modo mantenimiento, renderiza la página completa
  if (config.modo_mantenimiento) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <MaintenancePage />
        </body>
      </html>
    )
  }

  // ✅ Renderizado normal si NO está en mantenimiento
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
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 flex flex-col">
                {children}
                <Toaster />
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
