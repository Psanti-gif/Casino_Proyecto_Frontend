"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useAuth } from "@/lib/auth"
import { Lock } from "lucide-react"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [actual, setActual] = useState("")
  const [nueva, setNueva] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleGuardar = async () => {
    setMensaje("")
  
    if (!actual || !nueva || !confirmar) {
      setMensaje("Por favor completa todos los campos.")
      return
    }
  
    if (nueva !== confirmar) {
      setMensaje("La nueva contraseña no coincide con la confirmación.")
      return
    }
  
    if (nueva.length < 6) {
      setMensaje("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }
  
    if (!user?.id) {
      setMensaje("No se pudo identificar al usuario.")
      return
    }
  
    console.log({ id: user.id, actual, nueva }) // DEBUG opcional
  
    setCargando(true)
    try {
      const res = await fetch("http://localhost:8000/cambiar-contrasena", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id,
          actual,
          nueva
        })
      })
  
      const data = await res.json()
      if (res.ok) {
        alert(data.mensaje || "Contraseña actualizada correctamente")
        router.push("/main")
      } else {
        setMensaje(data?.mensaje || "No se pudo actualizar la contraseña")
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor")
      console.error(error)
    } finally {
      setCargando(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-black" />
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <Label>Contraseña actual</Label>
            <Input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1">
            <Label>Nueva contraseña</Label>
            <Input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1">
            <Label>Confirmar nueva contraseña</Label>
            <Input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/main")}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={cargando}>
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
