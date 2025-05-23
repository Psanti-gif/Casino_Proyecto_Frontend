"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot as Slot, DollarSign, Gauge, MapPin, Printer, ScrollText, Settings, Users } from "lucide-react"
import Link from "next/link"

interface MenuItem {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  roles: Array<'Admin' | 'Support' | 'Operator'>
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    description: "Vista general del sistema",
    href: "/dashboard",
    icon: <Gauge className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Máquinas",
    description: "Gestión de máquinas",
    href: "/machines",
    icon: <Slot className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Casinos",
    description: "Gestión de ubicaciones",
    href: "/locations",
    icon: <MapPin className="h-6 w-6" />,
    roles: ['Admin', 'Support'],
  },
  {
    title: "Contadores",
    description: "Registro de contadores",
    href: "/counters",
    icon: <ScrollText className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Balance por Máquina",
    description: "Balance individual por máquina",
    href: "/machine-balance",
    icon: <DollarSign className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Balance por Casino",
    description: "Balance general por casino",
    href: "/casino-balance",
    icon: <DollarSign className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Reportes",
    description: "Generación de reportes",
    href: "/reports",
    icon: <Printer className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
  },
  {
    title: "Usuarios",
    description: "Gestión de usuarios",
    href: "/users",
    icon: <Users className="h-6 w-6" />,
    roles: ['Admin', 'Support'],
  },
  {
    title: "Configuración",
    description: "Configuración del sistema",
    href: "/settings_app",
    icon: <Settings className="h-6 w-6" />,
    roles: ['Support'],
  },
]

export default function MainPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user.role as 'Admin' | 'Support' | 'Operator')
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Menú Principal</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema CUADRE CASINO
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMenuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {item.icon}
                  <CardTitle className="text-primary">{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
