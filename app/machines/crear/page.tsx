"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lugar {
  id: number
  nombre_casino: string
}

export default function CrearMaquinaPage() {
  const router = useRouter()

  const [codigo, setCodigo] = useState("")
  const [activo] = useState(1)
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

    cargarLugares()
    cargarMarcasYModelos()
  }, [])

  useEffect(() => {
    if (marca && marcasModelos[marca]) {
      setModelosDisponibles(marcasModelos[marca])
    } else {
      setModelosDisponibles([])
    }
    setModelo("")
  }, [marca, marcasModelos])

  const guardar = async () => {
    setError("") // limpiar error anterior

    const nuevaMaquina = {
      codigo,
      activo,
      marca,
      modelo,
      numero_serie: numeroSerie,
      denominacion: parseFloat(denominacion),
      casino
    }

    try {
      const res = await fetch("http://localhost:8000/maquinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaMaquina)
      })

      const data = await res.json()

      if (res.ok) {
        alert("Máquina registrada correctamente")
        router.push("/machines")
      } else {
        setError(data.detail || "Error al registrar la máquina")
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
          <CardTitle className="text-primary">Registrar Nueva Máquina</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <div className="text-red-600 text-sm border border-red-300 p-2 rounded">{error}</div>}

          <div>
            <Label>Código</Label>
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
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
              <Select value={modelo} onValueChange={setModelo} disabled={!marca}>
                <SelectTrigger>
                  <SelectValue placeholder={marca ? "Selecciona un modelo" : "Selecciona una marca primero"} />
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
            <Button className="bg-primary text-white" onClick={guardar}>Guardar Máquina</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
