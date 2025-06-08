"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Maquina {
  codigo: string
  activo: number
  marca: string
  modelo: string
  numero_serie: string
  denominacion: number
  casino: string
  porcentaje_participacion: number
}

export default function EditarMaquinaPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const router = useRouter()

  const [maquina, setMaquina] = useState<Maquina | null>(null)
  const [casinos, setCasinos] = useState<string[]>([])
  const [tieneParticipacion, setTieneParticipacion] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/maquina/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setMaquina(data)
          setTieneParticipacion(data.porcentaje_participacion > 0)
        })
        .catch(() => setError("Error al cargar la máquina"))
    }

    fetch("http://localhost:8000/listar-lugares")
      .then((res) => res.json())
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Object.entries(data).map(([_, lugar]: any) => lugar)
        const activos = lista.filter((l) => l.estado === "Activo").map((l) => l.nombre_casino)
        setCasinos(activos)
      })
  }, [id])

  const guardar = async () => {
    if (!id || !maquina) return
    setError("")

    const maquinaFinal = {
      ...maquina,
      porcentaje_participacion: tieneParticipacion ? maquina.porcentaje_participacion : 0
    }

    try {
      const res = await fetch(`http://localhost:8000/maquinas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(maquinaFinal),
      })

      if (res.ok) {
        alert("Máquina actualizada correctamente")
        router.push("/machines")
      } else {
        const data = await res.json()
        setError(data.detail || "Error al actualizar la máquina")
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor")
    }
  }

  if (!maquina) return <div className="text-center mt-10">Cargando datos...</div>

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/machines")}>← Volver</Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Editar Máquina</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <div className="text-red-600 text-sm border border-red-300 p-2 rounded">{error}</div>}

          <div>
            <Label>Código</Label>
            <Input value={maquina.codigo} disabled />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Input value={maquina.marca} onChange={(e) => setMaquina({ ...maquina, marca: e.target.value })} />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input value={maquina.modelo} onChange={(e) => setMaquina({ ...maquina, modelo: e.target.value })} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Número de Serie</Label>
              <Input value={maquina.numero_serie} onChange={(e) => setMaquina({ ...maquina, numero_serie: e.target.value })} />
            </div>
            <div>
              <Label>Denominación</Label>
              <Input
                type="number"
                step="0.01"
                value={maquina.denominacion}
                onChange={(e) =>
                  setMaquina({ ...maquina, denominacion: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Casino</Label>
              <Select
                value={maquina.casino}
                onValueChange={(value) => setMaquina({ ...maquina, casino: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un casino" />
                </SelectTrigger>
                <SelectContent>
                  {casinos.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tieneParticipacion"
                  checked={tieneParticipacion}
                  onCheckedChange={(value) => setTieneParticipacion(Boolean(value))}
                />
                <Label htmlFor="tieneParticipacion">¿Tiene participación?</Label>
              </div>

              <Label className="mt-2 block">Porcentaje de Participación</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={maquina.porcentaje_participacion}
                disabled={!tieneParticipacion}
                onChange={(e) =>
                  setMaquina({ ...maquina, porcentaje_participacion: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push("/machines")}>Cancelar</Button>
            <Button className="bg-primary text-white" onClick={guardar}>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
