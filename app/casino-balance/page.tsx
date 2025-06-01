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
    } catch (error) {
      console.error(error);
      setResultados([]);
    }
  };


  const guardarCuadre = async () => {
    if (resultados.length === 0) return;
  
    // Usamos la primera máquina como referencia para casino y fechas
    const referencia = resultados[0];
  
    const payload = {
      casino: referencia.casino,
      fecha_inicio: referencia.fecha_inicio,
      fecha_fin: referencia.fecha_fin,
      totales: {
        total_in: resultados.reduce((s, r) => s + r.total_in, 0),
        total_out: resultados.reduce((s, r) => s + r.total_out, 0),
        total_jackpot: resultados.reduce((s, r) => s + r.total_jackpot, 0),
        total_billetero: resultados.reduce((s, r) => s + r.total_billetero, 0),
        utilidad_total: resultados.reduce((s, r) => s + r.utilidad, 0),
      }
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/guardar-utilidad-casino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Error al guardar el cuadre");
  
      alert("Cuadre del casino guardado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el cuadre del casino.");
    }
  };
  

  const exportarExcel = () => {
    if (resultados.length === 0) return;

    const headers = [
      "Casino", "Máquina", "Fecha Inicial", "Fecha Final",
      "IN Inicial", "IN Final", "IN Total",
      "OUT Inicial", "OUT Final", "OUT Total",
      "Jackpot Inicial", "Jackpot Final", "Jackpot Total",
      "Billetero Inicial", "Billetero Final", "Billetero Total",
      "Ganancia"
    ];

    const rows = resultados.map(r => ([
      r.casino, r.maquina, r.fecha_inicio, r.fecha_fin,
      r.contador_inicial?.in ?? 0, r.contador_final?.in ?? 0, r.total_in ?? 0,
      r.contador_inicial?.out ?? 0, r.contador_final?.out ?? 0, r.total_out ?? 0,
      r.contador_inicial?.jackpot ?? 0, r.contador_final?.jackpot ?? 0, r.total_jackpot ?? 0,
      r.contador_inicial?.billetero ?? 0, r.contador_final?.billetero ?? 0, r.total_billetero ?? 0,
      r.utilidad ?? 0
    ]));

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "casino-balance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Balance por Casino</h1>
          <p className="text-muted-foreground">
            Consulta el balance de todas las máquinas de un casino en un período específico.
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
            <Button variant="outline" size="sm" onClick={() => {
              setStartDate(new Date(2023, 9, 1));
              setEndDate(new Date(2023, 10, 5));
              setCasinoSelected("all");
              setResultados([]);
            }}>
              <FilterX className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
            <Button size="sm" onClick={handleProcesarBalance}>
              <Calculator className="mr-2 h-4 w-4" />
              Calcular balance
            </Button>
          </div>
        </CardContent>
      </Card>

      {resultados.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Resultados <span className="ml-2 text-sm font-normal text-muted-foreground">({formatDateString(startDate)} <ArrowRight className="inline h-3 w-3 mx-1" /> {formatDateString(endDate)})</span>
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={guardarCuadre}>
                Guardar cuadre
              </Button>
              <Button variant="outline" size="sm" onClick={exportarExcel}>
                <FileDown className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportarPDF}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultados.map((r, index) => (
              <div key={index} className="border rounded-lg p-4 bg-muted">
                <div className="mb-2">
                  <strong>Máquina:</strong> {r.maquina} | <strong>Casino:</strong> {r.casino}
                </div>
                <div className="mb-2">
                  <strong>Desde:</strong> {r.fecha_inicio} | <strong>Hasta:</strong> {r.fecha_fin}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">IN Inicial</TableHead>
                      <TableHead className="text-right">IN Final</TableHead>
                      <TableHead className="text-right">IN Total</TableHead>
                      <TableHead className="text-right">OUT Inicial</TableHead>
                      <TableHead className="text-right">OUT Final</TableHead>
                      <TableHead className="text-right">OUT Total</TableHead>
                      <TableHead className="text-right">Jackpot Inicial</TableHead>
                      <TableHead className="text-right">Jackpot Final</TableHead>
                      <TableHead className="text-right">Jackpot Total</TableHead>
                      <TableHead className="text-right">Billetero Inicial</TableHead>
                      <TableHead className="text-right">Billetero Final</TableHead>
                      <TableHead className="text-right">Billetero Total</TableHead>
                      <TableHead className="text-right">Utilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-right">{r.contador_inicial?.in ?? 0}</TableCell>
                      <TableCell className="text-right">{r.contador_final?.in ?? 0}</TableCell>
                      <TableCell className="text-right">{r.total_in}</TableCell>
                      <TableCell className="text-right">{r.contador_inicial?.out ?? 0}</TableCell>
                      <TableCell className="text-right">{r.contador_final?.out ?? 0}</TableCell>
                      <TableCell className="text-right">{r.total_out}</TableCell>
                      <TableCell className="text-right">{r.contador_inicial?.jackpot ?? 0}</TableCell>
                      <TableCell className="text-right">{r.contador_final?.jackpot ?? 0}</TableCell>
                      <TableCell className="text-right">{r.total_jackpot}</TableCell>
                      <TableCell className="text-right">{r.contador_inicial?.billetero ?? 0}</TableCell>
                      <TableCell className="text-right">{r.contador_final?.billetero ?? 0}</TableCell>
                      <TableCell className="text-right">{r.total_billetero}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={r.utilidad >= 0 ? "success" : "destructive"}>
                          {formatCurrency(r.utilidad)}
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
