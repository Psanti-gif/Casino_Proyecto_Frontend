"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

export default function EditarEncargadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    estado: "Activo"
  })

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/buscar-encargado-id/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormulario({
          nombre: data.nombre || "",
          telefono: data.telefono || "",
          correo: data.correo || "",
          estado: data.estado || "Activo"
        })
      })
      .catch(() => {
        alert("No se pudo cargar la información del encargado")
        router.push("/encargados")
      })
  }, [id, router])

  const handleChange = (campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:8000/editar-encargado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario)
    })
    if (res.ok) {
      alert("Encargado actualizado")
      router.push("/encargados")
    } else {
      alert("Error al actualizar el encargado")
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/encargados")}
      >
        ← Volver
      </Button>

      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Editar Encargado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label className="text-sm">Nombre</Label>
              <Input
                value={formulario.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm">Telefono</Label>
              <Input
                type="tel"
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
                value={formulario.telefono}
                onChange={(e) => {
                  const valor = e.target.value
                  if (/^\d{0,10}$/.test(valor)) {
                    handleChange("telefono", valor)
                  }
                }}
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
              <Label className="text-sm">Estado</Label>
              <Select
                value={formulario.estado}
                onValueChange={(v) => handleChange("estado", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/encargados")}>
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
