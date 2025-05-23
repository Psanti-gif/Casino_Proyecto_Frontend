"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function CrearContadorPage() {
  const [casinos, setCasinos] = useState<any[]>([])
  const [maquinas, setMaquinas] = useState<any[]>([])
  const [casinoSeleccionado, setCasinoSeleccionado] = useState("")
  const [maquinasFiltradas, setMaquinasFiltradas] = useState<any[]>([])
  const [datos, setDatos] = useState({
    fecha: "",
    casino: "",
    maquina: "",
    in_contador: "",
    out_contador: "",
    jackpot_contador: "",
    billetero_contador: ""
  })
  const [mensaje, setMensaje] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:8000/listar-lugares")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCasinos(data)
        } else {
          console.warn("Respuesta inesperada de /listar-lugares:", data)
          setCasinos([])
        }
      })

    fetch("http://localhost:8000/maquinas")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const activas = data.filter((m: any) => m.activo === 1)
          setMaquinas(activas)
        } else {
          console.warn("Respuesta inesperada de /maquinas:", data)
          setMaquinas([])
        }
      })
  }, [])

  useEffect(() => {
    if (casinoSeleccionado) {
      const filtradas = maquinas.filter((m: any) => m.casino === casinoSeleccionado)
      setMaquinasFiltradas(filtradas)
      setDatos({ ...datos, casino: casinoSeleccionado, maquina: "" })
    }
  }, [casinoSeleccionado, maquinas])

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const guardar = async () => {
    setMensaje("")

    const campos = ["fecha", "casino", "maquina", "in_contador", "out_contador", "jackpot_contador", "billetero_contador"]
    for (let campo of campos) {
      if (!datos[campo as keyof typeof datos]) {
        setMensaje("Todos los campos son obligatorios")
        return
      }
    }

    const res = await fetch("http://localhost:8000/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        in_contador: parseFloat(datos.in_contador),
        out_contador: parseFloat(datos.out_contador),
        jackpot_contador: parseFloat(datos.jackpot_contador),
        billetero_contador: parseFloat(datos.billetero_contador)
      })
    })

    const data = await res.json()
    if (res.ok) {
      alert("Contador registrado exitosamente")
      router.push("/counters")
    } else {
      setMensaje(data.error || "Error al registrar")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={() => router.push("/counters")}>
          ← Volver
        </Button>
      </div>

      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Formulario de Registro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="fecha"
              value={datos.fecha}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <Label>Casino</Label>
            <Select value={casinoSeleccionado} onValueChange={setCasinoSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un casino" />
              </SelectTrigger>
              <SelectContent>
                {casinos.length > 0 ? (
                  casinos.map((casino: any) => (
                    <SelectItem key={casino.codigo} value={casino.nombre_casino}>
                      {casino.nombre_casino}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">No hay casinos disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Máquina</Label>
            <Select
              value={datos.maquina}
              onValueChange={(value) => setDatos({ ...datos, maquina: value })}
              disabled={!casinoSeleccionado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una máquina" />
              </SelectTrigger>
              <SelectContent>
                {maquinasFiltradas.length > 0 ? (
                  maquinasFiltradas.map((maquina: any) => (
                    <SelectItem key={maquina.id} value={maquina.codigo}>
                      {maquina.codigo} - {maquina.marca} {maquina.modelo}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">No hay máquinas disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Contador IN</Label>
            <Input
              type="number"
              name="in_contador"
              value={datos.in_contador}
              onChange={manejarCambio}
              min={0}
            />
          </div>

          <div>
            <Label>Contador OUT</Label>
            <Input
              type="number"
              name="out_contador"
              value={datos.out_contador}
              onChange={manejarCambio}
              min={0}
            />
          </div>

          <div>
            <Label>Contador JACKPOT</Label>
            <Input
              type="number"
              name="jackpot_contador"
              value={datos.jackpot_contador}
              onChange={manejarCambio}
              min={0}
            />
          </div>

          <div>
            <Label>Contador BILLETERO</Label>
            <Input
              type="number"
              name="billetero_contador"
              value={datos.billetero_contador}
              onChange={manejarCambio}
              min={0}
            />
          </div>

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => router.push("/counters")}>Cancelar</Button>
            <Button onClick={guardar}>Guardar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
