"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { CalendarIcon, RefreshCcw, FileText, FileSpreadsheet, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { fetchReporte, fetchCasinos, fetchMaquinas, exportarReporte } from "@/lib/api"

interface Registro {
  fecha_inicio?: string;
  fecha_fin?: string;
  casino: string;
  maquina: string;
  in: number;
  out: number;
  jackpot: number;
  billetero: number;
  utilidad: number;
  denominacion?: number;
  contador_inicial?: any;
  contador_final?: any;
}

export default function ReportsPage() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>()
  const [fechaFin, setFechaFin] = useState<Date | undefined>()
  const [casinoFiltro, setCasinoFiltro] = useState("Todos")
  const [casinos, setCasinos] = useState<any[]>([])
  const [maquinaFiltro, setMaquinaFiltro] = useState<string>("")
  const [modeloFiltro, setModeloFiltro] = useState("")
  const [mostrarReporte, setMostrarReporte] = useState(false)
  const [maquinas, setMaquinas] = useState<any[]>([])
  const [modelos, setModelos] = useState<string[]>([])
  const [porcentajeParticipacion, setPorcentajeParticipacion] = useState<number>(50)
  const [mostrarDialogoParticipacion, setMostrarDialogoParticipacion] = useState<boolean>(false)

  const cargarDatos = async () => {
    try {
      const params: any = {};
      if (fechaInicio) params.fechaInicio = fechaInicio.toISOString().split("T")[0];
      if (fechaFin) params.fechaFin = fechaFin.toISOString().split("T")[0];
      if (casinoFiltro && casinoFiltro !== "Todos") {
        params.casino = casinoFiltro;
      }
      if (maquinaFiltro && maquinaFiltro !== "Todos") params.maquinas = [maquinaFiltro];
      if (modeloFiltro && modeloFiltro !== "Todos") params.modelo = modeloFiltro;
      const data = await fetchReporte(params);
      const registrosData = Array.isArray(data.registros) ? data.registros : [];
      setRegistros(registrosData);
      // No actualizar el listado de casinos aquí, solo al cargar casinos
    } catch (error: any) {
      setRegistros([]);
      if (error.message && error.message.includes('Error al obtener el reporte')) {
        return;
      }
      alert('Ocurrió un error al consultar el reporte.');
    }
  }

  useEffect(() => {
    if (mostrarReporte) {
      cargarDatos()
      setMostrarReporte(false)
    }
    // eslint-disable-next-line
  }, [mostrarReporte])

  useEffect(() => {
    // Cargar casinos al montar
    fetchCasinos().then((data) => {
      setCasinos(data);
    }).catch((error) => {
      console.error("Error al cargar los casinos:", error);
    });
  }, []);

  useEffect(() => {
    // Cargar máquinas y modelos al montar
    fetchMaquinas().then((data) => {
      setMaquinas(data);
      setModelos(Array.from(new Set(data.map((m: any) => m.modelo))));
    }).catch((error) => {
      console.error("Error al cargar las máquinas:", error);
    });
  }, [])
  const utilidadTotal = Array.isArray(registros)
    ? registros.reduce((acc, r) => acc + r.utilidad, 0)
    : 0

  const handleExportarReporte = async (formato: 'pdf' | 'excel') => {
    try {
      const params: any = {};
      if (fechaInicio) params.fechaInicio = fechaInicio.toISOString().split("T")[0];
      if (fechaFin) params.fechaFin = fechaFin.toISOString().split("T")[0];
      if (casinoFiltro && casinoFiltro !== "Todos") {
        params.casino = casinoFiltro;
      }
      if (maquinaFiltro && maquinaFiltro !== "Todos") params.maquinas = [maquinaFiltro];
      if (modeloFiltro && modeloFiltro !== "Todos") params.modelo = modeloFiltro;
      await exportarReporte({
        formato,
        ...params
      });
    } catch (error: any) {
      alert(`Error al exportar el reporte: ${error.message || 'Error desconocido'}`);
    }
  };

  useEffect(() => {
    console.log("Casinos cargados:", casinos);
  }, [casinos]);

  useEffect(() => {
    if (casinoFiltro) {
      setMostrarReporte(false); // Reset mostrarReporte to ensure user clicks 'Mostrar Reporte' to fetch data
    }
  }, [casinoFiltro]);

  useEffect(() => {
    console.log("Casino seleccionado:", casinoFiltro);
  }, [casinoFiltro]);

  useEffect(() => {
    if (!mostrarReporte) {
      fetchCasinos().then((data) => {
        setCasinos(data);
      }).catch((error) => {
        console.error("Error al recargar los casinos:", error);
      });
    }
  }, [mostrarReporte]);

  // Filtrar modelos según la máquina seleccionada
  const modelosFiltrados = modeloFiltro === "Todos"
    ? modelos
    : modelos.filter((m) => {
        if (maquinaFiltro && maquinaFiltro !== "Todos") {
          // Solo mostrar modelos de la máquina seleccionada
          const maquina = maquinas.find((maq) => maq.codigo === maquinaFiltro);
          return maquina && maquina.modelo === m;
        }
        return true;
      });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Reportes</h1>
        <p className="text-muted-foreground">Visualización y análisis de contadores</p>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Fecha Inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaInicio ? fechaInicio.toLocaleDateString() : "Seleccionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar selected={fechaInicio} onSelect={setFechaInicio} mode="single" />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium">Fecha Fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaFin ? fechaFin.toLocaleDateString() : "Seleccionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar selected={fechaFin} onSelect={setFechaFin} mode="single" />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium">Casino</label>
          <Select value={casinoFiltro} onValueChange={setCasinoFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Casino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {casinos.map((c) => (
                <SelectItem key={c.codigo || c.nombre_casino} value={c.nombre_casino}>
                  {c.nombre_casino}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Máquina</label>
          <Select value={maquinaFiltro} onValueChange={setMaquinaFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Máquina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas</SelectItem>
              {maquinas.map((m) => (
                <SelectItem key={m.codigo} value={m.codigo}>{m.codigo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Modelo</label>
          <Select value={modeloFiltro} onValueChange={setModeloFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {modelosFiltrados.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="default" onClick={() => setMostrarReporte(true)}>
          Mostrar Reporte
        </Button>
        <Button variant="ghost" size="icon" onClick={cargarDatos}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        {registros.length > 0 && (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleExportarReporte('pdf')}
                    className="flex items-center justify-start gap-1"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Exportar PDF
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleExportarReporte('excel')}
                    className="flex items-center justify-start gap-1"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    Exportar Excel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Reporte de Contadores</CardTitle>
        </CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No hay resultados para los filtros seleccionados.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Casino</TableHead>
                  <TableHead>Máquina</TableHead>
                  <TableHead className="text-right">IN</TableHead>
                  <TableHead className="text-right">OUT</TableHead>
                  <TableHead className="text-right">JACKPOT</TableHead>
                  <TableHead className="text-right">BILLETERO</TableHead>
                  <TableHead className="text-right">UTILIDAD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.fecha_inicio || "-"}</TableCell>
                    <TableCell>{r.fecha_fin || "-"}</TableCell>
                    <TableCell>{r.casino}</TableCell>
                    <TableCell>{r.maquina}</TableCell>
                    <TableCell className="text-right">{r.in?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.out?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.jackpot?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.billetero?.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">{r.utilidad?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={8} className="text-right font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold text-green-700">
                    {utilidadTotal.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
