"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, FilterX, Calculator, FileDown, FileText, BarChart2 } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function CasinoBalancePage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 9, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 10, 5));
  const [casinos, setCasinos] = useState<any[]>([]);
  const [casinoSelected, setCasinoSelected] = useState("all");
  const [resultados, setResultados] = useState<any[]>([]);
  const [resumenPorCasino, setResumenPorCasino] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/listar-lugares")
      .then(res => res.json())
      .then(data => setCasinos(data))
      .catch(() => setCasinos([]));
  }, []);

  const formatDateString = (date?: Date) => {
    if (!date) return "Seleccionar fecha";
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const agruparPorCasino = (datos: any[]) => {
    const agrupado: Record<string, any> = {};

    for (const r of datos) {
      // Si el filtro es por un solo casino, usa ese nombre
      const nombreCasino = casinoSelected !== "all"
        ? casinoSelected
        : (r.casino ? String(r.casino).trim() : "Desconocido");

      if (!agrupado[nombreCasino]) {
        agrupado[nombreCasino] = {
          casino: nombreCasino,
          total_in: 0,
          total_out: 0,
          total_jackpot: 0,
          total_billetero: 0,
          utilidad: 0,
          maquinas: new Set(),
        };
      }
      agrupado[nombreCasino].total_in += r.total_in ?? 0;
      agrupado[nombreCasino].total_out += r.total_out ?? 0;
      agrupado[nombreCasino].total_jackpot += r.total_jackpot ?? 0;
      agrupado[nombreCasino].total_billetero += r.total_billetero ?? 0;
      agrupado[nombreCasino].utilidad += r.utilidad ?? 0;
      agrupado[nombreCasino].maquinas.add(r.maquina);
    }

    return Object.values(agrupado).map((casino: any) => ({
      ...casino,
      maquinas: Array.from(casino.maquinas),
    }));
  };

  const handleProcesarBalance = async () => {
    if (!startDate || !endDate || casinoSelected === "all") return;

    const body = {
      fecha_inicio: startDate.toISOString().split("T")[0],
      fecha_fin: endDate.toISOString().split("T")[0],
      casino: casinoSelected,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/cuadre_casino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Error al calcular el balance");

      const data = await response.json();
      setResultados(data.detalle_maquinas || []);
      setResumenPorCasino(agruparPorCasino(data.detalle_maquinas || []));
    } catch (error) {
      console.error(error);
      setResultados([]);
      setResumenPorCasino([]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Balance por Casino</h1>
          <p className="text-muted-foreground">
            Consulta el balance total de cada casino y sus máquinas.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateString(startDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateString(endDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Casino</label>
              <Select value={casinoSelected} onValueChange={setCasinoSelected}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar casino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {casinos.map(c => (
                    <SelectItem key={c.nombre_casino} value={c.nombre_casino}>
                      {c.nombre_casino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" onClick={handleProcesarBalance}>
              <Calculator className="mr-2 h-4 w-4" />
              Calcular balance
            </Button>
          </div>
        </CardContent>
      </Card>

      {resumenPorCasino.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Totales por Casino
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({formatDateString(startDate)} <ArrowRight className="inline h-3 w-3 mx-1" /> {formatDateString(endDate)})
                </span>
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    for (const c of resumenPorCasino) {
                      console.log("Guardando balance para casino:", c.casino);
                      await fetch("http://127.0.0.1:8000/guardar-utilidad-casino", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          casino: c.casino,
                          fecha_inicio: startDate?.toISOString().split("T")[0],
                          fecha_fin: endDate?.toISOString().split("T")[0],
                          totales: {
                            total_in: c.total_in,
                            total_out: c.total_out,
                            total_jackpot: c.total_jackpot,
                            total_billetero: c.total_billetero,
                            utilidad_total: c.utilidad,
                          }
                        }),
                      });
                    }
                    alert("Balance guardado correctamente.");
                  } catch (error) {
                    alert("Error al guardar el balance.");
                    console.error(error);
                  }
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Guardar balance
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumenPorCasino.map((c, i) => (
              <div key={i} className="border p-4 rounded-lg bg-muted">
                <h3 className="text-xl font-semibold mb-2">{c.casino}</h3>
                <p className="text-sm mb-2">Máquinas: {c.maquinas.join(", ")}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">IN Total</TableHead>
                      <TableHead className="text-right">OUT Total</TableHead>
                      <TableHead className="text-right">Jackpot Total</TableHead>
                      <TableHead className="text-right">Billetero Total</TableHead>
                      <TableHead className="text-right">Utilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-right">{formatCurrency(c.total_in)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.total_out)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.total_jackpot)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.total_billetero)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={c.utilidad >= 0 ? "success" : "destructive"}>
                          {formatCurrency(c.utilidad)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
