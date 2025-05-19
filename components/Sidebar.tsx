"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { DollarSign, Gauge, MapPin, Printer, ScrollText, Settings, Bot as Slot, Users } from 'lucide-react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: Array<'Admin' | 'Support' | 'Operator'>
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  
  // Don't show sidebar on login page
  if (pathname === '/login') return null
  if (!user) return null
  
  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <Gauge className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Máquinas',
      href: '/machines',
      icon: <Slot className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Ubicaciones',
      href: '/locations',
      icon: <MapPin className="h-5 w-5" />,
      roles: ['Admin', 'Support'],
    },
    {
      title: 'Contadores',
      href: '/counters',
      icon: <ScrollText className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Balance por Máquina',
      href: '/machine-balance',
      icon: <DollarSign className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Balance por Casino',
      href: '/casino-balance',
      icon: <DollarSign className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Reportes',
      href: '/reports',
      icon: <Printer className="h-5 w-5" />,
      roles: ['Admin', 'Support', 'Operator'],
    },
    {
      title: 'Usuarios',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['Admin'],
    },
    {
      title: 'Configuración',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['Admin'],
    },
  ]
  
  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user.role as 'Admin' | 'Support' | 'Operator')
  )
  
  return (
    <aside className="fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-56 border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
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