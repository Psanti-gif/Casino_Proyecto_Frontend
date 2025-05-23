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
  PlusCircle, Edit, XCircle, CheckCircle, RefreshCcw, Download
} from "lucide-react"
import * as XLSX from "xlsx"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Usuario {
  id: number
  nombre_usuario: string
  nombre_completo: string
  rol: string
  estado: string
}

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busquedaId, setBusquedaId] = useState("")
  const [busquedaUsuario, setBusquedaUsuario] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroRol, setFiltroRol] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const usuariosPorPagina = 5
  const router = useRouter()

  const recargar = async () => {
    const res = await fetch("http://localhost:8000/listar-usuarios")
    const data = await res.json()
    setUsuarios(data)
    setMensaje("")
    setPaginaActual(1)
  }

  useEffect(() => {
    recargar()
  }, [])

  useEffect(() => {
    const filtrar = async () => {
      if (busquedaId.trim() !== "") {
        const res = await fetch(`http://localhost:8000/buscar-usuario-id/${busquedaId.trim()}`)
        const data = await res.json()
        if (data?.id) {
          setUsuarios([data])
          setMensaje("")
          return
        } else {
          setUsuarios([])
          setMensaje("Usuario no encontrado")
          return
        }
      }

      if (busquedaUsuario.trim() !== "") {
        const res = await fetch(`http://localhost:8000/buscar-usuario/${busquedaUsuario.trim()}`)
        const data = await res.json()
        if (data?.id) {
          setUsuarios([data])
          setMensaje("")
          return
        } else {
          setUsuarios([])
          setMensaje("Usuario no encontrado")
          return
        }
      }

      recargar()
    }

    filtrar()
  }, [busquedaId, busquedaUsuario])

  const handleInhabilitar = async (id: number) => {
    if (!confirm("¿Inhabilitar este usuario?")) return
    const res = await fetch(`http://localhost:8000/inactivar-usuario/${id}`, { method: "PUT" })
    if (res.ok) recargar()
  }

  const handleActivar = async (id: number) => {
    const res = await fetch(`http://localhost:8000/activar-usuario/${id}`, { method: "PUT" })
    if (res.ok) recargar()
  }

  const exportarExcel = () => {
    const datos = usuariosFiltrados.map(usuario => ({
      ID: usuario.id,
      Usuario: usuario.nombre_usuario,
      "Nombre completo": usuario.nombre_completo,
      Rol: usuario.rol,
      Estado: usuario.estado
    }))
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, "Usuarios")
    XLSX.writeFile(libro, "usuarios.xlsx")
  }

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideRol = filtroRol === "Todos" || usuario.rol === filtroRol
    const coincideEstado = filtroEstado === "Todos" || usuario.estado === filtroEstado
    return coincideRol && coincideEstado
  })

  const inicio = (paginaActual - 1) * usuariosPorPagina
  const usuariosVisibles = usuariosFiltrados.slice(inicio, inicio + usuariosPorPagina)
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/users/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ingresar Usuario
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Buscar por ID</label>
          <Input
            placeholder="Ej: 1"
            value={busquedaId}
            onChange={(e) => {
              setBusquedaId(e.target.value)
              setBusquedaUsuario("")
            }}
            className="w-[160px]"
            type="number"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Buscar por Usuario</label>
          <Input
            placeholder="Ej: juanperez"
            value={busquedaUsuario}
            onChange={(e) => {
              setBusquedaUsuario(e.target.value)
              setBusquedaId("")
            }}
            className="w-[160px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Rol</label>
          <Select value={filtroRol} onValueChange={(v) => {
            setFiltroRol(v)
            setPaginaActual(1)
          }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Support">Soporte</SelectItem>
              <SelectItem value="Operator">Operador</SelectItem>
            </SelectContent>
          </Select>
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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setBusquedaId("")
            setBusquedaUsuario("")
            setFiltroRol("Todos")
            setFiltroEstado("Todos")
            setPaginaActual(1)
            recargar()
          }}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosVisibles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                usuariosVisibles.map(usuario => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell>{usuario.nombre_usuario}</TableCell>
                    <TableCell>{usuario.nombre_completo}</TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.estado === "Activo" ? "success" : "destructive"}>
                        {usuario.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/users/editar?id=${usuario.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {usuario.estado === "Activo" ? (
                          <Button variant="ghost" size="icon" onClick={() => handleInhabilitar(usuario.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleActivar(usuario.id)}>
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
