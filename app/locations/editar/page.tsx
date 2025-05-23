"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditarLugarPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get("id")

  const [codigo, setCodigo] = useState("")
  const [nombreCasino, setNombreCasino] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [encargado, setEncargado] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!id) return

    const obtenerLugar = async () => {
      try {
        const res = await fetch("http://localhost:8000/listar-lugares")
        const data = await res.json()
        const lugar = data.find((l: any) => l.id === parseInt(id))
        if (lugar) {
          setCodigo(lugar.codigo)
          setNombreCasino(lugar.nombre_casino)
          setCiudad(lugar.ciudad)
          setDireccion(lugar.direccion)
          setTelefono(lugar.telefono)
          setEncargado(lugar.persona_encargada)
        } else {
          setMensaje("Lugar no encontrado")
        }
      } catch (error) {
        setMensaje("Error al obtener el lugar")
      }
    }

    obtenerLugar()
  }, [id])

  const handleActualizar = async () => {
    setMensaje("")
    if (!codigo || !nombreCasino || !ciudad || !direccion || !telefono || !encargado) {
      setMensaje("Todos los campos son obligatorios.")
      return
    }

    setCargando(true)
    try {
      const res = await fetch(`http://localhost:8000/editar-lugar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          nombre_casino: nombreCasino,
          ciudad,
          direccion,
          telefono,
          persona_encargada: encargado
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.mensaje || "Lugar actualizado correctamente")
        router.push("/locations")
      } else {
        setMensaje(data.detail || "Error al actualizar el lugar")
      }
    } catch (error) {
      setMensaje("Error de red")
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
          <CardTitle>Editar Casino</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="codigo">Código</Label>
            <Input id="codigo" value={codigo} disabled />
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
            <Input id="encargado" value={encargado} onChange={(e) => setEncargado(e.target.value)} />
          </div>

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/locations")}>
              Cancelar
            </Button>
            <Button onClick={handleActualizar} disabled={cargando}>
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
