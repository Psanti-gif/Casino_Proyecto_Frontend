"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Menu, User } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [nombreEmpresa, setNombreEmpresa] = useState("CUADRE CASINO")
  const [logoUrl, setLogoUrl] = useState("")
  const [fechaHora, setFechaHora] = useState("")
  const [sistemaEnLinea, setSistemaEnLinea] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const res = await fetch("http://localhost:8000/configuracion")
        const data = await res.json()
        setNombreEmpresa(data.nombre_empresa || "CUADRE CASINO")
        setLogoUrl(data.logo_url || "")
        setTimestamp(Date.now())
      } catch (error) {
        console.error("No se pudo cargar la configuración", error)
      }
    }

    const verificarConexion = async () => {
      try {
        const res = await fetch("http://localhost:8000")
        setSistemaEnLinea(res.ok)
      } catch {
        setSistemaEnLinea(false)
      }
    }

    const actualizarHora = () => {
      const ahora = new Date()
      setFechaHora(ahora.toLocaleString("es-CO", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      }))
    }

    cargarConfiguracion()
    verificarConexion()
    actualizarHora()
    const intervaloHora = setInterval(actualizarHora, 1000)

    return () => clearInterval(intervaloHora)
  }, [])

  if (pathname === '/login') return null

  const toggleSidebar = () => {
    const current = localStorage.getItem("sidebarOpen") === "true"
    localStorage.setItem("sidebarOpen", JSON.stringify(!current))
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-6 flex h-16 items-center justify-between">
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/" className="flex items-center space-x-2">
            {logoUrl && (
              <img
                src={`http://localhost:8000${logoUrl}?v=${timestamp}`}
                alt="Logo"
                className="h-8 w-auto max-w-[160px] object-contain"
              />
            )}
            <span className="hidden sm:inline-block font-bold text-primary">
              {nombreEmpresa}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>{fechaHora}</span>
          <span className={sistemaEnLinea ? "text-green-600 font-medium" : "text-red-600"}>
            {sistemaEnLinea ? "En línea" : "✖ Sin conexión"}
          </span>
          {user && (
            <span className="text-muted-foreground">Rol: {user.role}</span>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="text-xs text-muted-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/users/change-password")}>
                  Cambiar contraseña
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
