"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { CalendarIcon, RefreshCcw } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"

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

export default function ReportsPage() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>()
  const [fechaFin, setFechaFin] = useState<Date | undefined>()
  const [casinoFiltro, setCasinoFiltro] = useState("Todos")
  const [casinos, setCasinos] = useState<string[]>([])

  const cargarDatos = async () => {
    const params = new URLSearchParams()
    if (fechaInicio) params.append("fecha_inicio", fechaInicio.toISOString().split("T")[0])
    if (fechaFin) params.append("fecha_fin", fechaFin.toISOString().split("T")[0])
    if (casinoFiltro !== "Todos") params.append("casino", casinoFiltro)

    const res = await fetch(`http://localhost:8000/generar-reporte?${params.toString()}`)
    const data = await res.json()
    const registrosData = Array.isArray(data.registros) ? data.registros : []
    setRegistros(registrosData)

    const unicos = Array.from(new Set(registrosData.map((r: Registro) => r.casino)))
    setCasinos(unicos as string[])
  }

  useEffect(() => {
    cargarDatos()
  }, [fechaInicio, fechaFin, casinoFiltro])

  const utilidadTotal = Array.isArray(registros)
    ? registros.reduce((acc, r) => acc + r.utilidad, 0)
    : 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Reportes</h1>
        <p className="text-muted-foreground">Visualización y análisis de contadores</p>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Fecha Inicio</label>
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
          <label className="text-sm font-medium">Fecha Fin</label>
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
          <label className="text-sm font-medium">Casino</label>
          <Select value={casinoFiltro} onValueChange={setCasinoFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Casino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {casinos.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" onClick={cargarDatos}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Reporte de Contadores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Casino</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead className="text-right">IN</TableHead>
                <TableHead className="text-right">OUT</TableHead>
                <TableHead className="text-right">JACKPOT</TableHead>
                <TableHead className="text-right">BILLETERO</TableHead>
                <TableHead className="text-right">UTILIDAD</TableHead>
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
                  <TableCell className="text-right font-semibold text-green-600">{r.utilidad.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold text-green-700">
                  {utilidadTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
