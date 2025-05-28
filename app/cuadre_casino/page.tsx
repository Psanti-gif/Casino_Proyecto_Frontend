"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverTrigger, PopoverContent
} from "@/components/ui/popover"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { CalendarIcon } from "lucide-react"

interface Registro {
  fecha: string
  casino: string
  maquina: string
  in: number
  out: number
  jackpot: number
  billetero: number
  utilidad: number
}

export default function CuadreCasinoPage() {
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>()
  const [fechaFin, setFechaFin] = useState<Date | undefined>()
  const [casinoFiltro, setCasinoFiltro] = useState("")
  const [registros, setRegistros] = useState<Registro[]>([])
  const [utilidadTotal, setUtilidadTotal] = useState<number>(0)

  const cargarDatos = async () => {
    const params = new URLSearchParams()
    if (fechaInicio) params.append("fecha_inicio", fechaInicio.toISOString().split("T")[0])
    if (fechaFin) params.append("fecha_fin", fechaFin.toISOString().split("T")[0])
    if (casinoFiltro) params.append("casino", casinoFiltro)

    const res = await fetch(`http://localhost:8000/cuadre-casino?${params.toString()}`)
    const data = await res.json()

    setRegistros(data.registros)
    setUtilidadTotal(data.utilidad_total)
  }

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarDatos()
    }
  }, [fechaInicio, fechaFin, casinoFiltro])

  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-2xl font-bold">Cuadre General por Casino</h1>

      <div className="flex gap-4">
        <div>
          <label>Fecha Inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaInicio ? fechaInicio.toLocaleDateString() : "Seleccionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar selected={fechaInicio} onSelect={setFechaInicio} mode="single" />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label>Fecha Fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaFin ? fechaFin.toLocaleDateString() : "Seleccionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar selected={fechaFin} onSelect={setFechaFin} mode="single" />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label>Casino</label>
          <Input
            value={casinoFiltro}
            onChange={(e) => setCasinoFiltro(e.target.value)}
            placeholder="Nombre del casino"
            className="w-[200px]"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Casino</TableHead>
            <TableHead>Máquina</TableHead>
            <TableHead className="text-right">IN</TableHead>
            <TableHead className="text-right">OUT</TableHead>
            <TableHead className="text-right">Jackpot</TableHead>
            <TableHead className="text-right">Billetero</TableHead>
            <TableHead className="text-right">Utilidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registros.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.fecha}</TableCell>
              <TableCell>{r.casino}</TableCell>
              <TableCell>{r.maquina}</TableCell>
              <TableCell className="text-right">{r.in.toLocaleString()}</TableCell>
              <TableCell className="text-right">{r.out.toLocaleString()}</TableCell>
              <TableCell className="text-right">{r.jackpot.toLocaleString()}</TableCell>
              <TableCell className="text-right">{r.billetero.toLocaleString()}</TableCell>
              <TableCell className="text-right font-semibold text-green-600">
                {r.utilidad.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          {registros.length > 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-right font-bold">Total</TableCell>
              <TableCell className="text-right font-bold text-green-700">
                {utilidadTotal.toLocaleString()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
