"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function CrearUsuarioPage() {
  const router = useRouter()
  const [formulario, setFormulario] = useState({
    nombre_usuario: "",
    nombre_completo: "",
    correo: "",
    rol: "Operator",
    estado: "Activo",
    contrasena: ""
  })

  const handleChange = (campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8000/agregar-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      })

      const texto = await res.text()
      let data: any = {}

      try {
        data = JSON.parse(texto)
      } catch (err) {
        console.error("Respuesta no es JSON:", texto)
        alert("Error inesperado. No se pudo interpretar la respuesta.")
        return
      }

      if (res.ok && data.id_asignado !== undefined) {
        alert("Usuario creado exitosamente con ID: " + data.id_asignado)
        router.push("/users")
      } else {
        alert("Error: " + (data.mensaje || "Error desconocido."))
      }
    } catch (error) {
      alert("Error de red o servidor.")
      console.error("Error al enviar los datos:", error)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/users")}
      >
        ← Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label className="text-sm">Nombre de Usuario</Label>
              <Input
                value={formulario.nombre_usuario}
                onChange={(e) => handleChange("nombre_usuario", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm">Nombre Completo</Label>
              <Input
                value={formulario.nombre_completo}
                onChange={(e) => handleChange("nombre_completo", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm">Correo</Label>
              <Input
                type="email"
                value={formulario.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm">Rol</Label>
              <Select value={formulario.rol} onValueChange={(v) => handleChange("rol", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Estado</Label>
              <Select value={formulario.estado} onValueChange={(v) => handleChange("estado", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Contraseña</Label>
              <Input
                type="password"
                value={formulario.contrasena}
                onChange={(e) => handleChange("contrasena", e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
