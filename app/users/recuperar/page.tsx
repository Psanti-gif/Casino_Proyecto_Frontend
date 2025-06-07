"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"

export default function RecuperarContrasenaPage() {
  const router = useRouter()

  const [paso, setPaso] = useState(1)
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [codigo, setCodigo] = useState("")
  const [nueva, setNueva] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const solicitarCodigo = async () => {
    setMensaje("")
    if (!nombreUsuario.trim()) {
      setMensaje("Debes ingresar el nombre de usuario.")
      return
    }

    setCargando(true)
    try {
      const res = await fetch("http://localhost:8000/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario: nombreUsuario })
      })
      const data = await res.json()
      if (res.ok) {
        setPaso(2)
        alert("Se envió un código al correo registrado.")
      } else {
        setMensaje(data.detail || "Error al solicitar el código")
      }
    } catch (error) {
      setMensaje("Error de conexión")
    } finally {
      setCargando(false)
    }
  }

  const cambiarContrasena = async () => {
    setMensaje("")
    if (!codigo || !nueva || !confirmar) {
      setMensaje("Por favor completa todos los campos.")
      return
    }

    if (nueva !== confirmar) {
      setMensaje("Las contraseñas no coinciden.")
      return
    }

    if (nueva.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setCargando(true)
    try {
      const res = await fetch("http://localhost:8000/recuperar-contrasena-validar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: nombreUsuario,
          codigo,
          nueva_contrasena: nueva
        })
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.mensaje || "Contraseña actualizada")
        router.push("/login")
      } else {
        setMensaje(data.detail || "No se pudo cambiar la contraseña")
      }
    } catch (error) {
      setMensaje("Error de red")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {paso === 1 && (
            <>
              <div>
                <Label>Nombre de Usuario</Label>
                <Input
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Cancelar
                </Button>
                <Button onClick={solicitarCodigo} disabled={cargando}>
                  Solicitar Código
                </Button>
              </div>
            </>
          )}

          {paso === 2 && (
            <>
              <div>
                <Label>Código recibido</Label>
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>
              <div>
                <Label>Nueva contraseña</Label>
                <Input
                  type="password"
                  value={nueva}
                  onChange={(e) => setNueva(e.target.value)}
                />
              </div>
              <div>
                <Label>Confirmar nueva contraseña</Label>
                <Input
                  type="password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Cancelar
                </Button>
                <Button onClick={cambiarContrasena} disabled={cargando}>
                  Cambiar Contraseña
                </Button>
              </div>
            </>
          )}

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
