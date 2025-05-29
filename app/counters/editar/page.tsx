"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export default function EditarContadorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fechaParam = searchParams.get("fecha")
  const casinoParam = searchParams.get("casino")

  const [datos, setDatos] = useState({
    fecha: "",
    casino: "",
    maquina: "",
    in_contador: "",
    out_contador: "",
    jackpot_contador: "",
    billetero_contador: "",
    recorte: false
  })
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    if (fechaParam && casinoParam) {
      fetch(`http://localhost:8000/buscar/?fecha=${fechaParam}&casino=${casinoParam}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const registro = data[0]
            setDatos({
              fecha: registro.fecha,
              casino: registro.casino,
              maquina: registro.maquina,
              in_contador: registro.in.toString(),
              out_contador: registro.out.toString(),
              jackpot_contador: registro.jackpot.toString(),
              billetero_contador: registro.billetero.toString(),
              recorte: registro.recorte || false
            })
          } else {
            setMensaje("Registro no encontrado")
          }
        })
    }
  }, [fechaParam, casinoParam])

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value })
  }

  const guardar = async () => {
    setMensaje("")
    const res = await fetch("http://localhost:8000/modificar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        in_contador: parseFloat(datos.in_contador),
        out_contador: parseFloat(datos.out_contador),
        jackpot_contador: parseFloat(datos.jackpot_contador),
        billetero_contador: parseFloat(datos.billetero_contador),
        recorte: datos.recorte
      })
    })

    const data = await res.json()
    if (res.ok) {
      alert("Registro modificado correctamente")
      router.push("/counters")
    } else {
      setMensaje(data.error || "No se pudo modificar el registro")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/counters")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>

      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Editar Contador</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Fecha como input tipo date */}
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="fecha"
              value={datos.fecha}
              onChange={(e) => setDatos({ ...datos, fecha: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label>Casino</Label>
            <Input type="text" value={datos.casino} disabled />
          </div>

          <div>
            <Label>Máquina</Label>
            <Input type="text" value={datos.maquina} disabled />
          </div>

          <div>
            <Label>Contador IN</Label>
            <Input
              type="number"
              name="in_contador"
              value={datos.in_contador}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <Label>Contador OUT</Label>
            <Input
              type="number"
              name="out_contador"
              value={datos.out_contador}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <Label>Contador JACKPOT</Label>
            <Input
              type="number"
              name="jackpot_contador"
              value={datos.jackpot_contador}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <Label>Contador BILLETERO</Label>
            <Input
              type="number"
              name="billetero_contador"
              value={datos.billetero_contador}
              onChange={manejarCambio}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recorte"
              checked={datos.recorte}
              onCheckedChange={(value) => setDatos({ ...datos, recorte: Boolean(value) })}
            />
            <Label htmlFor="recorte">¿Hubo corte o reinicio de la máquina?</Label>
          </div>

          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => router.push("/counters")}>
              Cancelar
            </Button>
            <Button onClick={guardar}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

