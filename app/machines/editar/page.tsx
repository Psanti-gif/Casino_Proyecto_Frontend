"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lugar {
  id: number
  nombre_casino: string
}

export default function EditarMaquinaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  const [codigo, setCodigo] = useState("")
  const [activo, setActivo] = useState(1)
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [numeroSerie, setNumeroSerie] = useState("")
  const [denominacion, setDenominacion] = useState("")
  const [casino, setCasino] = useState("")
  const [casinos, setCasinos] = useState<Lugar[]>([])
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([])
  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>([])
  const [marcasModelos, setMarcasModelos] = useState<Record<string, string[]>>({})
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarMaquina = async () => {
      const res = await fetch(`http://localhost:8000/maquina/${id}`)
      if (!res.ok) {
        setError("No se pudo cargar la máquina")
        return
      }
      const data = await res.json()
      setCodigo(data.codigo)
      setActivo(data.activo)
      setMarca(data.marca)
      setModelo(data.modelo)
      setNumeroSerie(data.numero_serie)
      setDenominacion(data.denominacion.toString())
      setCasino(data.casino)
    }

    const cargarLugares = async () => {
      const res = await fetch("http://localhost:8000/listar-lugares")
      const data = await res.json()
      const lista = Array.isArray(data)
        ? data
        : Object.entries(data).map(([id, lugar]: any) => ({ id: Number(id), ...lugar }))
      setCasinos(lista.filter((l: any) => l.estado === "Activo"))
    }

    const cargarMarcasYModelos = async () => {
      const res = await fetch("http://localhost:8000/marcas_modelos.json")
      const data = await res.json()
      setMarcasModelos(data)
      setMarcasDisponibles(Object.keys(data))
    }

    if (id) {
      cargarMaquina()
      cargarLugares()
      cargarMarcasYModelos()
    }
  }, [id])

  useEffect(() => {
    if (marca && marcasModelos[marca]) {
      setModelosDisponibles(marcasModelos[marca])
    } else {
      setModelosDisponibles([])
    }
  }, [marca, marcasModelos])

  const guardar = async () => {
    setError("")

    const datosEditados = {
      codigo,
      activo,
      marca,
      modelo,
      numero_serie: numeroSerie,
      denominacion: parseFloat(denominacion),
      casino
    }

    try {
      const res = await fetch(`http://localhost:8000/maquinas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEditados)
      })

      const data = await res.json()

      if (res.ok) {
        alert("Máquina actualizada correctamente")
        router.push("/machines")
      } else {
        setError(data.detail || "Error al actualizar la máquina")
      }
    } catch (err) {
      console.error(err)
      setError("No se pudo conectar con el servidor")
    }
  }

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
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Select value={marca} onValueChange={(value) => setMarca(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcasDisponibles.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Modelo</Label>
              <Select
                value={modelo}
                onValueChange={setModelo}
                disabled={!marca || modelosDisponibles.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !marca
                      ? "Selecciona una marca primero"
                      : modelosDisponibles.length === 0
                        ? "Esta marca no tiene modelos"
                        : "Selecciona un modelo"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {modelosDisponibles.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Número de Serie</Label>
              <Input value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} required />
            </div>
            <div>
              <Label>Denominación</Label>
              <Input type="number" step="0.01" value={denominacion} onChange={(e) => setDenominacion(e.target.value)} required />
            </div>
          </div>

          <div>
            <Label>Casino</Label>
            <Select value={casino} onValueChange={setCasino}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un casino" />
              </SelectTrigger>
              <SelectContent>
                {casinos.map((c) => (
                  <SelectItem key={c.id} value={c.nombre_casino}>{c.nombre_casino}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
