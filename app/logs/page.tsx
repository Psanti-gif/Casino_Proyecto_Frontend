"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

interface Log {
  usuario: string
  accion: string
  modulo: string
  detalles: string
  timestamp: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/logs")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(() => alert("Error al cargar logs"))
  }, [])

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logs)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Historial")
    XLSX.writeFile(wb, "historial_cambios.xlsx")
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Historial de Cambios</CardTitle>
          <Button onClick={exportarExcel} className="flex items-center gap-2">
            <Download size={16} /> Exportar Excel
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{log.usuario}</TableCell>
                  <TableCell>{log.accion}</TableCell>
                  <TableCell>{log.modulo}</TableCell>
                  <TableCell>{log.detalles}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
