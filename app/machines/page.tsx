"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle, Edit, XCircle, CheckCircle, RefreshCcw, Download
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"

interface Maquina {
  id: number
  codigo: string
  activo: number
  marca: string
  modelo: string
  numero_serie: string
  denominacion: number
  casino: string
}

export default function MachinesPage() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [marcaFiltro, setMarcaFiltro] = useState("Todas")
  const [modeloFiltro, setModeloFiltro] = useState("Todos")
  const [casinoFiltro, setCasinoFiltro] = useState("Todos")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [codigoBusqueda, setCodigoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const maquinasPorPagina = 5

  const router = useRouter()

  const cargarMaquinas = async () => {
    try {
      const res = await fetch("http://localhost:8000/maquinas")
      const data = await res.json()
      setMaquinas(Array.isArray(data) ? data : [])
      setPaginaActual(1)
    } catch (error) {
      console.error("Error al cargar máquinas:", error)
    }
  }

  const inactivar = async (id: number) => {
    const res = await fetch(`http://localhost:8000/maquinas/${id}/inactivar`, { method: "PUT" })
    if (res.ok) cargarMaquinas()
  }

  const activar = async (id: number) => {
    const res = await fetch(`http://localhost:8000/maquinas/${id}/activar`, { method: "PUT" })
    if (res.ok) cargarMaquinas()
  }

  const exportarAExcel = () => {
    const data = filtradas.map((m) => ({
      Asset: m.codigo,
      Marca: m.marca,
      Modelo: m.modelo,
      Denominacion: `$${m.denominacion.toFixed(2)}`,
      Casino: m.casino,
      Estado: m.activo === 1 ? "Activa" : "Inactiva",
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Maquinas")
    XLSX.writeFile(wb, "maquinas.xlsx")
  }

  useEffect(() => {
    cargarMaquinas()
  }, [])

  const marcas = Array.from(new Set(maquinas.map((m) => m.marca)))
  const modelos = Array.from(new Set(maquinas.filter((m) =>
    marcaFiltro === "Todas" || m.marca === marcaFiltro
  ).map((m) => m.modelo)))
  const casinos = Array.from(new Set(maquinas.map((m) => m.casino)))

  const filtradas = maquinas.filter((m) =>
    (marcaFiltro === "Todas" || m.marca === marcaFiltro) &&
    (modeloFiltro === "Todos" || m.modelo === modeloFiltro) &&
    (casinoFiltro === "Todos" || m.casino === casinoFiltro) &&
    (estadoFiltro === "Todos" ||
      (estadoFiltro === "Activa" && m.activo === 1) ||
      (estadoFiltro === "Inactiva" && m.activo !== 1)) &&
    (codigoBusqueda.trim() === "" || m.codigo.toLowerCase().includes(codigoBusqueda.toLowerCase()))
  )

  const totalPaginas = Math.ceil(filtradas.length / maquinasPorPagina)
  const inicio = (paginaActual - 1) * maquinasPorPagina
  const maquinasVisibles = filtradas.slice(inicio, inicio + maquinasPorPagina)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Máquinas</h1>
          <p className="text-muted-foreground">Gestión de máquinas registradas en el sistema</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button variant="outline" onClick={exportarAExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/machines/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Máquina
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Buscar por Asset</label>
          <Input
            placeholder="Ej: M-1001"
            value={codigoBusqueda}
            onChange={(e) => {
              setCodigoBusqueda(e.target.value)
              setPaginaActual(1)
            }}
            className="w-[160px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <Select value={estadoFiltro} onValueChange={(v) => {
            setEstadoFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Marca</label>
          <Select value={marcaFiltro} onValueChange={(v) => {
            setMarcaFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              {marcas.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Modelo</label>
          <Select value={modeloFiltro} onValueChange={(v) => {
            setModeloFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {modelos.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Casino</label>
          <Select value={casinoFiltro} onValueChange={(v) => {
            setCasinoFiltro(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Casino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {casinos.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setCodigoBusqueda("")
            setMarcaFiltro("Todas")
            setModeloFiltro("Todos")
            setCasinoFiltro("Todos")
            setEstadoFiltro("Todos")
            setPaginaActual(1)
            cargarMaquinas()
          }}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Lista de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Denominación</TableHead>
                <TableHead>Casino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maquinasVisibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron máquinas.
                  </TableCell>
                </TableRow>
              ) : (
                maquinasVisibles.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.codigo}</TableCell>
                    <TableCell>{m.marca}</TableCell>
                    <TableCell>{m.modelo}</TableCell>
                    <TableCell>${m.denominacion.toFixed(2)}</TableCell>
                    <TableCell>{m.casino}</TableCell>
                    <TableCell>
                      <Badge variant={m.activo === 1 ? "success" : "destructive"}>
                        {m.activo === 1 ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/machines/editar?id=${m.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {m.activo === 1 ? (
                          <Button variant="ghost" size="icon" onClick={() => inactivar(m.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => activar(m.id)}>
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
            <span className="text-sm">
              Página {paginaActual} de {totalPaginas || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >← Anterior</Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >Siguiente →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
