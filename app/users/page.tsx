"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle,
  Edit,
  XCircle,
  CheckCircle,
  RefreshCcw
} from "lucide-react"

interface Usuario {
  id: number
  nombre_usuario: string
  nombre_completo: string
  rol: string
  estado: string
}

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const usuariosPorPagina = 5
  const inputRef = useRef<HTMLInputElement>(null)
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
    inputRef.current?.focus()
  }, [])

  const handleInhabilitar = async (id: number) => {
    if (!confirm("¿Inhabilitar este usuario?")) return
    const res = await fetch(`http://localhost:8000/inactivar-usuario/${id}`, { method: "PUT" })
    if (res.ok) window.location.reload()
  }

  const handleActivar = async (id: number) => {
    const res = await fetch(`http://localhost:8000/activar-usuario/${id}`, { method: "PUT" })
    if (res.ok) window.location.reload()
  }

  const buscarUsuario = async () => {
    const termino = busqueda.trim()
    if (!termino) {
      recargar()
      return
    }

    setMensaje("")

    const esNumero = /^\d+$/.test(termino)
    const url = esNumero
      ? `http://localhost:8000/buscar-usuario-id/${termino}`
      : `http://localhost:8000/buscar-usuario/${termino}`

    const res = await fetch(url)
    const data = await res.json()

    if (data?.id) {
      setUsuarios([data])
      setBusqueda("")
      inputRef.current?.focus()
      setPaginaActual(1)
    } else {
      setUsuarios([])
      setMensaje(data?.mensaje || "Usuario no encontrado")
    }
  }

  const inicio = (paginaActual - 1) * usuariosPorPagina
  const usuariosVisibles = usuarios.slice(inicio, inicio + usuariosPorPagina)
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>
          <Button onClick={() => router.push("/users/crear")}> <PlusCircle className="mr-2 h-4 w-4" /> Ingresar Usuario </Button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          placeholder="Buscar por ID o nombre de usuario"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarUsuario()}
          className="max-w-sm"
        />
        <Button onClick={buscarUsuario}>Buscar</Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setBusqueda("")
            recargar()
            inputRef.current?.focus()
          }}
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="sr-only">Refrescar</span>
        </Button>
      </div>

      {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

      <Card>
        <CardHeader><CardTitle>Lista de Usuarios</CardTitle></CardHeader>
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
                      {usuario.estado === "Activo" ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {usuario.estado === "Activo" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/users/editar?id=${usuario.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleInhabilitar(usuario.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/users/editar?id=${usuario.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleActivar(usuario.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex justify-between items-center p-4">
          <span className="text-sm">Página {paginaActual} de {totalPaginas}</span>
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
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >Siguiente →</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
