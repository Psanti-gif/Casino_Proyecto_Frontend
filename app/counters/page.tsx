"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, RefreshCcw, Download, ArrowLeft, ArrowRight } from "lucide-react"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"

interface CounterRecord {
  fecha: string
  casino: string
  maquina: string
  in: number
  out: number
  jackpot: number
  billetero: number
  recorte: boolean
}

export default function CountersPage() {
  const router = useRouter()
  const [records, setRecords] = useState<CounterRecord[]>([])
  const [filtroCasino, setFiltroCasino] = useState("Todos")
  const [filtroMaquina, setFiltroMaquina] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroRecorte, setFiltroRecorte] = useState("Todos")
  const [casinosUnicos, setCasinosUnicos] = useState<string[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const porPagina = 6

  useEffect(() => {
    fetch("http://localhost:8000/registros")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data)
          const casinos = Array.from(new Set(data.map((r: any) => r.casino)))
          setCasinosUnicos(casinos)
        } else {
          setRecords([])
        }
      })
  }, [])

  const filtrar = (r: CounterRecord) => {
    const porCasino = filtroCasino === "Todos" || r.casino === filtroCasino
    const porMaquina = filtroMaquina.trim() === "" || r.maquina.toLowerCase().includes(filtroMaquina.toLowerCase())
    const porFecha = filtroFecha === "" || r.fecha === filtroFecha
    const porRecorte = filtroRecorte === "Todos" || (filtroRecorte === "Si" ? r.recorte : !r.recorte)
    return porCasino && porMaquina && porFecha && porRecorte
  }

  const registrosFiltrados = records.filter(filtrar)
  const totalPaginas = Math.ceil(registrosFiltrados.length / porPagina)
  const inicio = (paginaActual - 1) * porPagina
  const visibles = registrosFiltrados.slice(inicio, inicio + porPagina)

  const exportarExcel = () => {
    const datos = registrosFiltrados.map(r => ({
      Fecha: r.fecha,
      Casino: r.casino,
      Maquina: r.maquina,
      IN: r.in,
      OUT: r.out,
      JACKPOT: r.jackpot,
      BILLETERO: r.billetero,
      RECORTE: r.recorte ? "Si" : "No"
    }))
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, "Contadores")
    XLSX.writeFile(libro, "contadores.xlsx")
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contadores</h1>
          <p className="text-muted-foreground">Registros diarios de contadores</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/counters/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Contador
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Máquina</label>
          <Input
            placeholder="Buscar por máquina"
            value={filtroMaquina}
            onChange={(e) => setFiltroMaquina(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Casino</label>
          <Select value={filtroCasino} onValueChange={setFiltroCasino}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por casino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {casinosUnicos.map((c, i) => (
                <SelectItem key={i} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Fecha</label>
          <Input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-[180px]"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div>
          <label className="text-sm font-medium">¿Hubo corte?</label>
          <Select value={filtroRecorte} onValueChange={setFiltroRecorte}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrar por corte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Si">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setFiltroCasino("Todos")
            setFiltroMaquina("")
            setFiltroFecha("")
            setFiltroRecorte("Todos")
            setPaginaActual(1)
          }}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Lista de Registros</CardTitle>
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
                <TableHead className="text-right">Jackpot</TableHead>
                <TableHead className="text-right">Billetero</TableHead>
                <TableHead>Recorte</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">No hay registros</TableCell>
                </TableRow>
              ) : (
                visibles.map((r, index) => (
                  <TableRow key={index}>
                    <TableCell>{r.fecha}</TableCell>
                    <TableCell>{r.casino}</TableCell>
                    <TableCell>{r.maquina}</TableCell>
                    <TableCell className="text-right">{r.in.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.out.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.jackpot.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.billetero.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={r.recorte ? "destructive" : "default"}>
                        {r.recorte ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/counters/editar?fecha=${r.fecha}&casino=${encodeURIComponent(r.casino)}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center pt-4">
            <span className="text-sm">Página {paginaActual} de {totalPaginas || 1}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}>← Anterior</Button>
              <Button variant="outline" size="sm" disabled={paginaActual === totalPaginas || totalPaginas === 0}
                onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
