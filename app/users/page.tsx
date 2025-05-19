
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"

interface Usuario {
  id: number
  nombre_usuario: string
  nombre_completo: string
  rol: string
  estado: string
}

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:8000/listar-usuarios")
        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de usuarios")
        }
        const data = await res.json()
        setUsuarios(data)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarUsuarios()
  }, [])

  const handleEditar = (usuario: Usuario) => {
    console.log("Editar usuario:", usuario)
  }

  const handleInhabilitar = (id: number) => {
    console.log("Inhabilitar usuario con id:", id)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestión de usuarios del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
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
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map(usuario => (
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(usuario)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleInhabilitar(usuario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Inhabilitar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}