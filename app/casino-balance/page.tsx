"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowRight, Calendar as CalendarIcon, FilterX, Calculator, FileDown, FileText, ArrowLeft, BarChart2 } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Location {
  id: string
  name: string
}

interface MaquinaResumen {
  maquina: string
  fecha_inicio: string
  fecha_fin: string
  total_in: number
  total_out: number
  total_jackpot: number
  total_billetero: number
  utilidad: number
}

interface TotalesCasino {
  total_in: number
  total_out: number
  total_jackpot: number
  total_billetero: number
  utilidad_total: number
}

export default function CasinoBalancePage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [casino, setCasino] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [detalles, setDetalles] = useState<MaquinaResumen[]>([])
  const [totales, setTotales] = useState<TotalesCasino | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("http://127.0.0.1:8000/listar-lugares")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((l: any) => ({
          id: l.id,
          name: l.nombre_casino
        }))
        setLocations(mapped)
      })
  }, [])

  const handleProcesar = async () => {
    if (!casino || !startDate || !endDate) return

    const res = await fetch("http://127.0.0.1:8000/cuadre-casino", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        casino,
        fecha_inicio: startDate.toISOString().split("T")[0],
        fecha_fin: endDate.toISOString().split("T")[0],
      }),
    })

    if (!res.ok) {
      alert("Error al calcular el cuadre")
      return
    }

    const json = await res.json()
    setDetalles(json.detalle_maquinas)
    setTotales(json.totales)
  }

  const limpiar = () => {
    setCasino("")
    setStartDate(undefined)
    setEndDate(undefined)
    setDetalles([])
    setTotales(null)
  }

  const exportarExcel = () => {
    const filas = [
      ["Máquina", "IN", "OUT", "JACKPOT", "BILLETERO", "UTILIDAD"],
      ...detalles.map(r => [
        r.maquina,
        r.total_in,
        r.total_out,
        r.total_jackpot,
        r.total_billetero,
        r.utilidad,
      ]),
      ["Total", totales?.total_in ?? 0, totales?.total_out ?? 0, totales?.total_jackpot ?? 0, totales?.total_billetero ?? 0, totales?.utilidad_total ?? 0]
    ]

    const contenido = filas.map(row => row.join(",")).join("\n")
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `balance_casino_${casino}.csv`
    link.click()
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text(`Balance por Casino: ${casino}`, 14, 15)

    autoTable(doc, {
      startY: 25,
      head: [[
        "Máquina", "Inicio", "Fin",
        "IN", "OUT", "JACKPOT", "BILLETERO", "UTILIDAD"
      ]],
      body: detalles.map(r => [
        r.maquina,
        r.fecha_inicio,
        r.fecha_fin,
        r.total_in.toLocaleString(),
        r.total_out.toLocaleString(),
        r.total_jackpot.toLocaleString(),
        r.total_billetero.toLocaleString(),
        r.utilidad.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
      ]),
      foot: [[
        "TOTALES", "", "",
        totales?.total_in.toLocaleString() ?? 0,
        totales?.total_out.toLocaleString() ?? 0,
        totales?.total_jackpot.toLocaleString() ?? 0,
        totales?.total_billetero.toLocaleString() ?? 0,
        totales?.utilidad_total.toLocaleString("es-CO", { style: "currency", currency: "COP" }) ?? 0
      ]]
    })

    doc.save(`Balance_Casino_${casino}.pdf`)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Balance por Casino</h1>
          <p className="text-muted-foreground">Resumen consolidado por casino en un rango de fechas</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Select value={casino} onValueChange={setCasino}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona casino" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd/MM/yyyy') : "Seleccionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar selected={startDate} onSelect={setStartDate} mode="single" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd/MM/yyyy') : "Seleccionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar selected={endDate} onSelect={setEndDate} mode="single" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 items-end justify-end">
            <Button variant="outline" onClick={limpiar}>
              <FilterX className="mr-2 h-4 w-4" /> Limpiar
            </Button>
            <Button onClick={handleProcesar}>
              <Calculator className="mr-2 h-4 w-4" /> Calcular
            </Button>
          </div>
        </CardContent>
      </Card>

      {totales && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              <CardTitle className="text-left">
                Resultados ({format(startDate!, 'dd/MM/yyyy')} <ArrowRight className="inline h-4 w-4 mx-1" /> {format(endDate!, 'dd/MM/yyyy')})
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportarExcel}>
                <FileDown className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportarPDF}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>IN</TableHead>
                  <TableHead>OUT</TableHead>
                  <TableHead>JACKPOT</TableHead>
                  <TableHead>BILLETERO</TableHead>
                  <TableHead>UTILIDAD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalles.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.maquina}</TableCell>
                    <TableCell>{r.fecha_inicio}</TableCell>
                    <TableCell>{r.fecha_fin}</TableCell>
                    <TableCell>{r.total_in.toLocaleString()}</TableCell>
                    <TableCell>{r.total_out.toLocaleString()}</TableCell>
                    <TableCell>{r.total_jackpot.toLocaleString()}</TableCell>
                    <TableCell>{r.total_billetero.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={r.utilidad >= 0 ? "success" : "destructive"}
                        className="justify-center w-24"
                      >
                        {r.utilidad.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell>Total</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell>{totales.total_in.toLocaleString()}</TableCell>
                  <TableCell>{totales.total_out.toLocaleString()}</TableCell>
                  <TableCell>{totales.total_jackpot.toLocaleString()}</TableCell>
                  <TableCell>{totales.total_billetero.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={totales.utilidad_total >= 0 ? "success" : "destructive"}
                      className="justify-center w-24"
                    >
                      {totales.utilidad_total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
