"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle, Edit, XCircle, CheckCircle, RefreshCcw, Download, ArrowDown, ArrowUp
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"

interface Lugar {
  id: number
  codigo: string
  nombre_casino: string
  ciudad: string
  direccion: string
  telefono: string
  persona_encargada: string
  estado: string
}

export default function LocationsPage() {
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [busquedaCodigo, setBusquedaCodigo] = useState("")
  const [busquedaNombre, setBusquedaNombre] = useState("")
  const [encargadoFiltro, setEncargadoFiltro] = useState("Todos")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [paginaActual, setPaginaActual] = useState(1)
  const [ordenColumna, setOrdenColumna] = useState<keyof Lugar | null>(null)
  const [ordenAscendente, setOrdenAscendente] = useState(true)
  const lugaresPorPagina = 5
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const cargarLugares = async () => {
    const res = await fetch("http://localhost:8000/listar-lugares")
    const data = await res.json()
    if (Array.isArray(data)) {
      setLugares(data)
      setPaginaActual(1)
    }
  }

  useEffect(() => {
    cargarLugares()
    inputRef.current?.focus()
  }, [])

  const inactivarLugar = async (id: number) => {
    if (!confirm("¿Inactivar este lugar?")) return
    const res = await fetch(`http://localhost:8000/inactivar-lugar/${id}`, { method: "PUT" })
    if (res.ok) cargarLugares()
  }

  const activarLugar = async (id: number) => {
    const res = await fetch(`http://localhost:8000/activar-lugar/${id}`, { method: "PUT" })
    if (res.ok) cargarLugares()
  }

  const exportarExcel = () => {
    const datos = filtrados.map((lugar) => ({
      ID: lugar.id,
      Código: lugar.codigo,
      Nombre: lugar.nombre_casino,
      Ciudad: lugar.ciudad,
      Dirección: lugar.direccion,
      Teléfono: lugar.telefono,
      Encargado: lugar.persona_encargada,
      Estado: lugar.estado,
    }))
    const ws = XLSX.utils.json_to_sheet(datos)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Casinos")
    XLSX.writeFile(wb, "casinos.xlsx")
  }

  const encargados = Array.from(new Set(lugares.map(l => l.persona_encargada)))
  const estados = Array.from(new Set(lugares.map(l => l.estado)))

  let filtrados = lugares.filter((l) =>
    l.codigo.toLowerCase().includes(busquedaCodigo.trim().toLowerCase()) &&
    l.nombre_casino.toLowerCase().includes(busquedaNombre.trim().toLowerCase()) &&
    (encargadoFiltro === "Todos" || l.persona_encargada === encargadoFiltro) &&
    (estadoFiltro === "Todos" || l.estado === estadoFiltro)
  )

  if (ordenColumna) {
    filtrados = filtrados.sort((a, b) => {
      const valA = a[ordenColumna] ?? ""
      const valB = b[ordenColumna] ?? ""
      return ordenAscendente
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }

  const totalPaginas = Math.ceil(filtrados.length / lugaresPorPagina)
  const inicio = (paginaActual - 1) * lugaresPorPagina
  const visibles = filtrados.slice(inicio, inicio + lugaresPorPagina)

  const cambiarOrden = (col: keyof Lugar) => {
    if (ordenColumna === col) {
      setOrdenAscendente(!ordenAscendente)
    } else {
      setOrdenColumna(col)
      setOrdenAscendente(true)
    }
  }

  const iconoOrden = (col: keyof Lugar) =>
    ordenColumna === col ? (ordenAscendente ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Casinos</h1>
          <p className="text-muted-foreground">Gestión de casinos registrados</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/locations/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Casino
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Buscar por código</label>
          <Input
            placeholder="Ej: M1"
            value={busquedaCodigo}
            onChange={(e) => {
              setBusquedaCodigo(e.target.value)
              setPaginaActual(1)
            }}
            className="w-[160px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Buscar por nombre</label>
          <Input
            placeholder="Ej: Casino Cali"
            value={busquedaNombre}
            onChange={(e) => {
              setBusquedaNombre(e.target.value)
              setPaginaActual(1)
            }}
            className="w-[160px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Encargado</label>
          <Select value={encargadoFiltro} onValueChange={(v) => {
            setEncargadoFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Encargado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {encargados.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <Select value={estadoFiltro} onValueChange={(v) => {
            setEstadoFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {estados.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setBusquedaCodigo("")
            setBusquedaNombre("")
            setEncargadoFiltro("Todos")
            setEstadoFiltro("Todos")
            setPaginaActual(1)
            setOrdenColumna(null)
            cargarLugares()
          }}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Lista de Casinos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => cambiarOrden("codigo")} className="cursor-pointer">
                  Código {iconoOrden("codigo")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("nombre_casino")} className="cursor-pointer">
                  Nombre {iconoOrden("nombre_casino")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("ciudad")} className="cursor-pointer">
                  Ciudad {iconoOrden("ciudad")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("direccion")} className="cursor-pointer">
                  Dirección {iconoOrden("direccion")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("telefono")} className="cursor-pointer">
                  Teléfono {iconoOrden("telefono")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("persona_encargada")} className="cursor-pointer">
                  Encargado {iconoOrden("persona_encargada")}
                </TableHead>
                <TableHead onClick={() => cambiarOrden("estado")} className="cursor-pointer">
                  Estado {iconoOrden("estado")}
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">No se encontraron registros.</TableCell>
                </TableRow>
              ) : (
                visibles.map((lugar) => (
                  <TableRow key={lugar.id}>
                    <TableCell>{lugar.codigo}</TableCell>
                    <TableCell>{lugar.nombre_casino}</TableCell>
                    <TableCell>{lugar.ciudad}</TableCell>
                    <TableCell>{lugar.direccion}</TableCell>
                    <TableCell>{lugar.telefono}</TableCell>
                    <TableCell>{lugar.persona_encargada}</TableCell>
                    <TableCell>
                      <Badge variant={lugar.estado === "Activo" ? "success" : "destructive"}>
                        {lugar.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/locations/editar?id=${lugar.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {lugar.estado === "Activo" ? (
                          <Button variant="ghost" size="icon" onClick={() => inactivarLugar(lugar.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => activarLugar(lugar.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
