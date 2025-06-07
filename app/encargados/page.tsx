"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle, Edit, XCircle, CheckCircle, RefreshCcw, Download, ArrowUp, ArrowDown
} from "lucide-react"
import * as XLSX from "xlsx"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Encargado {
  id: number
  nombre: string
  telefono: string
  correo: string
  estado: string
}

export default function EncargadosPage() {
  const [encargados, setEncargados] = useState<Encargado[]>([])
  const [busquedaNombre, setBusquedaNombre] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [paginaActual, setPaginaActual] = useState(1)
  const [ordenColumna, setOrdenColumna] = useState<keyof Encargado | null>(null)
  const [ordenAscendente, setOrdenAscendente] = useState(true)
  const encargadosPorPagina = 5
  const router = useRouter()

  const cargarEncargados = async () => {
    const res = await fetch("http://localhost:8000/listar-encargados")
    const data = await res.json()
    setEncargados(data)
    setPaginaActual(1)
  }

  useEffect(() => {
    cargarEncargados()
  }, [])

  const handleInactivar = async (id: number) => {
    if (!confirm("¿Inactivar este encargado?")) return
    await fetch(`http://localhost:8000/inactivar-encargado/${id}`, { method: "PUT" })
    cargarEncargados()
  }

  const handleActivar = async (id: number) => {
    await fetch(`http://localhost:8000/activar-encargado/${id}`, { method: "PUT" })
    cargarEncargados()
  }

  const exportarExcel = () => {
    const datos = encargadosFiltrados.map(e => ({
      ID: e.id,
      Nombre: e.nombre,
      Telefono: e.telefono,
      Correo: e.correo,
      Estado: e.estado
    }))
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, "Encargados")
    XLSX.writeFile(libro, "encargados.xlsx")
  }

  const cambiarOrden = (col: keyof Encargado) => {
    if (ordenColumna === col) {
      setOrdenAscendente(!ordenAscendente)
    } else {
      setOrdenColumna(col)
      setOrdenAscendente(true)
    }
  }

  const iconoOrden = (col: keyof Encargado) =>
    ordenColumna === col ? (ordenAscendente ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : null

  let encargadosFiltrados = encargados.filter(e => {
    const coincideNombre = e.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
    const coincideEstado = filtroEstado === "Todos" || e.estado === filtroEstado
    return coincideNombre && coincideEstado
  })

  if (ordenColumna) {
    encargadosFiltrados.sort((a, b) => {
      const valA = a[ordenColumna] ?? ""
      const valB = b[ordenColumna] ?? ""
      return ordenAscendente
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }

  const inicio = (paginaActual - 1) * encargadosPorPagina
  const encargadosVisibles = encargadosFiltrados.slice(inicio, inicio + encargadosPorPagina)
  const totalPaginas = Math.ceil(encargadosFiltrados.length / encargadosPorPagina)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Encargados</h1>
          <p className="text-muted-foreground">Gestión de encargados de casinos</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/encargados/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ingresar Encargado
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Buscar por Nombre</label>
          <Input
            placeholder="Ej: Pedro"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            className="w-[160px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <Select value={filtroEstado} onValueChange={(v) => {
            setFiltroEstado(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" onClick={() => {
          setBusquedaNombre("")
          setFiltroEstado("Todos")
          setOrdenColumna(null)
          cargarEncargados()
        }}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Lista de Encargados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => cambiarOrden("nombre")} className="cursor-pointer">
                  Nombre {iconoOrden("nombre")}
                </TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {encargadosVisibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron encargados.
                  </TableCell>
                </TableRow>
              ) : (
                encargadosVisibles.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nombre}</TableCell>
                    <TableCell>{e.telefono}</TableCell>
                    <TableCell>{e.correo}</TableCell>
                    <TableCell>
                      <Badge variant={e.estado === "Activo" ? "success" : "destructive"}>
                        {e.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/encargados/editar?id=${e.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {e.estado === "Activo" ? (
                          <Button variant="ghost" size="icon" onClick={() => handleInactivar(e.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleActivar(e.id)}>
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
