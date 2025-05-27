"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit } from "lucide-react"

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

  useEffect(() => {
    fetch("http://localhost:8000/registros")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data)
        } else {
          console.warn("Respuesta inesperada del backend:", data)
          setRecords([])
        }
      })
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contadores</h1>
          <p className="text-muted-foreground">Registros diarios de contadores</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button className="bg-primary text-white" onClick={() => router.push("/counters/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Contador
          </Button>
        </div>
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
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">No hay registros</TableCell>
                </TableRow>
              ) : (
                records.map((r, index) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
