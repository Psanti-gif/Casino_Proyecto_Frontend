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
    title: "Encargados",
    description: "Gestión de encargados de casino",
    href: "/encargados",
    icon: <Users className="h-6 w-6" />,
    roles: ['Admin', 'Support'],
  },
  {
    title: "Casinos",
    description: "Gestión de ubicaciones",
    href: "/locations",
    icon: <MapPin className="h-6 w-6" />,
    roles: ['Admin', 'Support'],
  },
  {
    title: "Máquinas",
    description: "Gestión de máquinas",
    href: "/machines",
    icon: <Slot className="h-6 w-6" />,
    roles: ['Admin', 'Support', 'Operator'],
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
    <div className="container mx-auto px-4 flex flex-col items-center flex-1 py-12">
      <div className="mb-4 text-center w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Menú Principal</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Bienvenido al sistema
        </p>
      </div>

      <div className="w-full flex justify-center">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
          {filteredMenuItems.map((item, index) => (
            <Link key={index} href={item.href} className="block h-full">
              <Card className="hover:bg-accent/50 transition-colors h-full w-full min-w-0 sm:min-w-[220px] sm:max-w-full">
                <CardHeader className="h-full">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <CardTitle className="text-primary text-lg md:text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm md:text-base">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
