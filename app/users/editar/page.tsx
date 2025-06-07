"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

export default function EditarUsuarioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [form, setForm] = useState({
    nombre_usuario: "", nombre_completo: "", correo: "",
    rol: "Operator", estado: "Activo", contrasena: ""
  })

  const [verContrasena, setVerContrasena] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/buscar-usuario-id/${id}`)
      .then(res => res.json())
      .then(data => setForm({
        nombre_usuario: data.nombre_usuario || "",
        nombre_completo: data.nombre_completo || "",
        correo: data.correo || "",
        rol: data.rol || "Operator",
        estado: data.estado || "Activo",
        contrasena: data.contrasena || ""
      }))
      .catch(() => router.push("/users"))
  }, [id, router])

  const handleChange = (campo: string, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:8000/editar-usuario/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_completo: form.nombre_completo,
        correo: form.correo,
        rol: form.rol,
        estado: form.estado,
        contrasena: form.contrasena
      })
    })
    if (res.ok) {
      alert("Usuario actualizado")
      router.push("/users")
    } else {
      const msg = await res.json()
      alert("Error: " + (msg.mensaje || "No se pudo editar"))
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/users")}>
        ← Volver
      </Button>
      <Card>
        <CardHeader className="text-primary"><CardTitle>Editar Usuario</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div><Label>Nombre de Usuario</Label><Input value={form.nombre_usuario} disabled /></div>
            <div><Label>Nombre Completo</Label><Input value={form.nombre_completo} onChange={(e) => handleChange("nombre_completo", e.target.value)} required /></div>
            <div><Label>Correo</Label><Input type="email" value={form.correo} onChange={(e) => handleChange("correo", e.target.value)} required /></div>
            <div><Label>Rol</Label>
              <Select value={form.rol} onValueChange={(v) => handleChange("rol", v)}>
                <SelectTrigger><SelectValue placeholder="Rol" /></SelectTrigger>
                <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Support">Support</SelectItem><SelectItem value="Operator">Operator</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => handleChange("estado", v)}>
                <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem></SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contraseña</Label>
              <div className="relative">
                <Input
                  type={verContrasena ? "text" : "password"}
                  value={form.contrasena}
                  onChange={(e) => handleChange("contrasena", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.push("/users")}>Cancelar</Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
