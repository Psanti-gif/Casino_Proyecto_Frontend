"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Lugar {
  id: number
  nombre_casino: string
}

const MARCAS_MODELOS = {
  "IGT": ["Game King", "Wheel of Fortune", "Double Diamond", "S2000", "Cleopatra"],
  "Aristocrat": ["Buffalo", "Dragon Link", "Lightning Link", "Pompeii", "Queen of the Nile"],
  "Konami": ["China Shores", "Fortune Stacks", "Dragon's Law", "Lotus Land", "Jumpin Jalapenos"],
  "Scientific Games": ["Zeus", "Monopoly", "Quick Hit", "Hot Shot", "Cash Spin"],
  "Novomatic": ["Book of Ra", "Sizzling Hot", "Lucky Lady's Charm", "Columbus", "Dolphin's Pearl"]
}

export default function EditarMaquinaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [cargando, setCargando] = useState(true)
  const [codigo, setCodigo] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [numeroSerie, setNumeroSerie] = useState("")
  const [denominacion, setDenominacion] = useState("")
  const [casino, setCasino] = useState("")
  const [casinos, setCasinos] = useState<Lugar[]>([])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resMaquina = await fetch(`http://localhost:8000/maquinas`)
        const maquinas = await resMaquina.json()
        const maquina = maquinas.find((m: any) => m.id.toString() === id)
        if (!maquina) throw new Error("No encontrada")

        setCodigo(maquina.codigo)
        setMarca(maquina.marca)
        setModelo(maquina.modelo)
        setNumeroSerie(maquina.numero_serie)
        setDenominacion(maquina.denominacion.toString())
        setCasino(maquina.casino)

        const resLugares = await fetch("http://localhost:8000/listar-lugares")
        const data = await resLugares.json()
        const lista = Array.isArray(data)
          ? data
          : Object.entries(data).map(([id, l]: any) => ({ id: Number(id), ...l }))
        setCasinos(lista.filter((l) => l.estado === "Activo"))
      } catch (error) {
        alert("Error al cargar datos de la máquina.")
        router.push("/machines")
      } finally {
        setCargando(false)
      }
    }

    if (id) cargarDatos()
  }, [id, router])

  const guardarCambios = async () => {
    const maquinaEditada = {
      codigo,
      activo: 1,
      marca,
      modelo,
      numero_serie: numeroSerie,
      denominacion: parseFloat(denominacion),
      casino
    }

    const res = await fetch(`http://localhost:8000/maquinas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maquinaEditada)
    })

    if (res.ok) {
      alert("Máquina actualizada correctamente")
      router.push("/machines")
    } else {
      alert("Error al actualizar la máquina")
    }
  }

  if (cargando) return <p className="p-4">Cargando...</p>

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/machines")}>
        ← Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Editar Máquina</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
        <div>
        <Label>Código</Label>
        <Input value={codigo} disabled />
        </div>


          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Select value={marca} onValueChange={(value) => {
                setMarca(value)
                setModelo("")
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(MARCAS_MODELOS).map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Modelo</Label>
              <Select value={modelo} onValueChange={setModelo} disabled={!marca}>
                <SelectTrigger>
                  <SelectValue placeholder={marca ? "Selecciona un modelo" : "Selecciona una marca"} />
                </SelectTrigger>
                <SelectContent>
                  {(MARCAS_MODELOS[marca] || []).map((m) => (
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
                  <SelectItem key={c.id} value={c.nombre_casino}>
                    {c.nombre_casino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push("/machines")}>
              Cancelar
            </Button>
            <Button className="bg-primary text-white" onClick={guardarCambios}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
