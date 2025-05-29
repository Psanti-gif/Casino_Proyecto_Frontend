"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"

interface Encargado {
  id: number
  nombre: string
  estado: string
}

export default function EditarLugarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre_casino: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    persona_encargada: "",
    estado: "Activo"
  })

  const [encargados, setEncargados] = useState<Encargado[]>([])
  const [mensaje, setMensaje] = useState("")

  const cargarLugar = async () => {
    if (!id) return
    const res = await fetch(`http://localhost:8000/buscar-lugar-id/${id}`)
    const data = await res.json()
    if (data?.mensaje) {
      alert(data.mensaje)
      router.push("/locations")
    } else {
      setFormulario(data)
    }
  }

  const cargarEncargados = async () => {
    const res = await fetch("http://localhost:8000/listar-encargados")
    const data = await res.json()
    const activos = data.filter((e: Encargado) => e.estado === "Activo")
    setEncargados(activos)
  }

  useEffect(() => {
    cargarLugar()
    cargarEncargados()
  }, [id])

  const handleChange = (campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`http://localhost:8000/editar-lugar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      })
      const data = await res.json()
      if (res.ok) {
        alert("Casino actualizado correctamente")
        router.push("/locations")
      } else {
        setMensaje(data.detail || "Error al actualizar")
      }
    } catch {
      setMensaje("Error de red o servidor")
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/locations")}>
        ← Volver
      </Button>

      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Editar Casino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label className="text-sm">Código</Label>
              <Input value={formulario.codigo} onChange={(e) => handleChange("codigo", e.target.value)} disabled />
            </div>
            <div>
              <Label className="text-sm">Nombre del Casino</Label>
              <Input value={formulario.nombre_casino} onChange={(e) => handleChange("nombre_casino", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Ciudad</Label>
              <Input value={formulario.ciudad} onChange={(e) => handleChange("ciudad", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Dirección</Label>
              <Input value={formulario.direccion} onChange={(e) => handleChange("direccion", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Teléfono</Label>
              <Input value={formulario.telefono} onChange={(e) => handleChange("telefono", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Persona Encargada</Label>
              <Select value={formulario.persona_encargada} onValueChange={(v) => handleChange("persona_encargada", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar encargado" />
                </SelectTrigger>
                <SelectContent>
                  {encargados.map((e) => (
                    <SelectItem key={e.id} value={e.nombre}>
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Estado</Label>
              <Select value={formulario.estado} onValueChange={(v) => handleChange("estado", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/locations")}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
