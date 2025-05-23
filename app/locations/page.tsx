"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle, Edit, XCircle, CheckCircle,
  RefreshCcw, Download
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"

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
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const lugaresPorPagina = 5
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const cargarLugares = async () => {
    try {
      const res = await fetch("http://localhost:8000/listar-lugares")
      const data = await res.json()
      if (Array.isArray(data)) {
        setLugares(data)
        setPaginaActual(1)
      }
    } catch (error) {
      console.error("Error al cargar lugares:", error)
      setLugares([])
    }
  }

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

  useEffect(() => {
    cargarLugares()
    inputRef.current?.focus()
  }, [])

  const filtrados = lugares.filter((l) =>
    l.nombre_casino.toLowerCase().includes(busqueda.trim().toLowerCase())
  )

  const totalPaginas = Math.ceil(filtrados.length / lugaresPorPagina)
  const inicio = (paginaActual - 1) * lugaresPorPagina
  const visibles = filtrados.slice(inicio, inicio + lugaresPorPagina)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary bg-transparent">Casinos</h1>
          <p className="text-muted-foreground">Gestión de usuarios de casinos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/main")}>
            ← Volver
          </Button>
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/maqinas/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ingresar Máquina
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          placeholder="Buscar por nombre de casino"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          className="max-w-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setBusqueda("")
            inputRef.current?.focus()
            setPaginaActual(1)
            cargarLugares()
          }}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-primary">Lista de Casinos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Encargado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron lugares.
                  </TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/locations/editar?id=${lugar.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {lugar.estado === "Activo" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => inactivarLugar(lugar.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => activarLugar(lugar.id)}
                          >
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
