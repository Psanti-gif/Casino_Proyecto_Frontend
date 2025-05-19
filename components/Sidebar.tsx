"use client"

import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import {
  X, DollarSign, Gauge, MapPin, Printer,
  ScrollText, Settings, Bot as Slot, Users
} from 'lucide-react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: Array<'Admin' | 'Support' | 'Operator'>
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Cargar el estado desde localStorage y escuchar cambios
  useEffect(() => {
    const cargarEstado = () => {
      const sidebarFlag = localStorage.getItem("sidebarOpen")
      if (sidebarFlag === null) {
        localStorage.setItem("sidebarOpen", "false")
        setIsOpen(false)
      } else {
        setIsOpen(sidebarFlag === "true")
      }
    }

    cargarEstado()
    window.addEventListener("storage", cargarEstado)
    return () => window.removeEventListener("storage", cargarEstado)
  }, [])

  if (pathname === '/login' || !user) return null

  const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', href: '/', icon: <Gauge className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Máquinas', href: '/machines', icon: <Slot className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Ubicaciones', href: '/locations', icon: <MapPin className="h-5 w-5" />, roles: ['Admin', 'Support'] },
    { title: 'Contadores', href: '/counters', icon: <ScrollText className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Balance por Máquina', href: '/machine-balance', icon: <DollarSign className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Balance por Casino', href: '/casino-balance', icon: <DollarSign className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Reportes', href: '/reports', icon: <Printer className="h-5 w-5" />, roles: ['Admin', 'Support', 'Operator'] },
    { title: 'Usuarios', href: '/users', icon: <Users className="h-5 w-5" />, roles: ['Admin'] },
    { title: 'Configuración', href: '/settings', icon: <Settings className="h-5 w-5" />, roles: ['Admin'] },
  ]

  const filteredItems = sidebarItems.filter(item =>
    item.roles.includes(user.role as 'Admin' | 'Support' | 'Operator')
  )

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-full w-56 border-r bg-background shadow-md transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Encabezado con botón de cerrar */}
      <div className="h-16 flex items-center justify-between border-b px-4 text-lg font-bold">
        CUADRE CASINO
        <button
          className="p-1 rounded hover:bg-muted transition"
          onClick={() => {
            localStorage.setItem("sidebarOpen", "false")
            window.dispatchEvent(new Event("storage"))
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-[calc(100%-4rem)] flex-col gap-2 overflow-y-auto p-4">
        <nav className="grid gap-1">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
