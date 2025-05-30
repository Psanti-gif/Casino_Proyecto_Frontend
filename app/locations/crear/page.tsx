"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"

interface Encargado {
  id: number
  nombre: string
  estado: string
}

export default function CrearLugarPage() {
  const router = useRouter()

  const [codigo, setCodigo] = useState("")
  const [nombreCasino, setNombreCasino] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [encargado, setEncargado] = useState("")
  const [encargados, setEncargados] = useState<Encargado[]>([])
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const cargarEncargados = async () => {
    try {
      const res = await fetch("http://localhost:8000/listar-encargados")
      const data = await res.json()
      const activos = data.filter((e: Encargado) => e.estado === "Activo")
      setEncargados(activos)
    } catch {
      setMensaje("Error al cargar encargados")
    }
  }

  useEffect(() => {
    cargarEncargados()
  }, [])

  const handleGuardar = async () => {
    setMensaje("")

    if (!codigo || !nombreCasino || !ciudad || !direccion || !telefono || !encargado) {
      setMensaje("Todos los campos son obligatorios.")
      return
    }

    setCargando(true)
    try {
      const res = await fetch("http://localhost:8000/agregar-lugar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          nombre_casino: nombreCasino,
          ciudad,
          direccion,
          telefono,
          persona_encargada: encargado,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.mensaje || "Lugar registrado correctamente")
        router.push("/locations")
      } else {
        setMensaje(data.detail || "No se pudo registrar el lugar")
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/locations")}>
          ← Volver
        </Button>
      </div>
      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Registrar Casino</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="codigo">Código</Label>
            <Input id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del Casino</Label>
            <Input id="nombre" value={nombreCasino} onChange={(e) => setNombreCasino(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="encargado">Persona Encargada</Label>
            <Select value={encargado} onValueChange={(v) => setEncargado(v)}>
              <SelectTrigger className="w-full">
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

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/locations")}>
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
