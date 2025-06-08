"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Lock, LogIn } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [nombreApp, setNombreApp] = useState("CUADRE CASINO")
  const [logoUrl, setLogoUrl] = useState("")
  const [ipLocal, setIpLocal] = useState("localhost")

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const res = await fetch("http://localhost:8000/configuracion")
        const data = await res.json()
        setNombreApp(data.nombre_empresa || "CUADRE CASINO")
        setLogoUrl(data.logo_url || "")
      } catch (error) {
        console.error("No se pudo cargar la configuración", error)
      }
    }

    const obtenerIP = async () => {
      try {
        const res = await fetch("http://localhost:8000/obtener-ip")
        const data = await res.json()
        if (data.ip) {
          setIpLocal(data.ip)
        }
      } catch (error) {
        console.error("No se pudo obtener la IP", error)
        setIpLocal("localhost")
      }
    }

    cargarConfiguracion()
    obtenerIP()
  }, [])

  useEffect(() => {
    if (user) {
      router.push("/main")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema CUADRE CASINO",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "Credenciales incorrectas. Por favor, intente nuevamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) return null

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          {logoUrl && (
            <img
              src={`http://localhost:8000${logoUrl}`}
              alt="Logo"
              className="mx-auto h-16 object-contain"
            />
          )}
          <CardTitle className="text-3xl font-bold tracking-tight mt-2">
            {nombreApp}
          </CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
            <br />
            <br />
            <span className="text-sm text-muted-foreground">
              Tambien puede ingresar desde la direccion: {ipLocal}:3000
            </span>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="Ingrese su usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Lock className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </Button>
            <a
              href="/users/recuperar"
              className="text-sm text-blue-600 hover:underline text-center"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
