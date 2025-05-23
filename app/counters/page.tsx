"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface CounterRecord {
  id: string
  machineId: string
  casino: string
  date: string
  inValue: number
  outValue: number
  jackpotValue: number
  billeteroValue: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default function CountersPage() {
  const router = useRouter()
  const [records, setRecords] = useState<CounterRecord[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/registros")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const parsed = data.map((item: any, idx: number) => ({
            id: `R-${idx + 1}`,
            machineId: item.maquina,
            casino: item.casino,
            date: item.fecha,
            inValue: item.in,
            outValue: item.out,
            jackpotValue: item.jackpot,
            billeteroValue: item.billetero,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "1"
          }))
          setRecords(parsed)
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
          <Button variant="outline" onClick={() => router.push("/main")}>
            ← Volver
          </Button>
          <Button className="bg-primary text-white" onClick={() => router.push("/counters/crear")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Contador
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Lista de Registros</CardTitle>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">No hay registros</TableCell>
                </TableRow>
              ) : (
                records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.casino}</TableCell>
                    <TableCell>{r.machineId}</TableCell>
                    <TableCell className="text-right">{r.inValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.outValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.jackpotValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.billeteroValue.toLocaleString()}</TableCell>
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
