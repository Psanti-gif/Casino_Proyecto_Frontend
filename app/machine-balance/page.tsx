"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"
import { FilterX, BarChart2, Calendar, ArrowRight, Calculator, FileDown } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Machine, Location, MachineBalance } from "@/types"

// Elimina sampleCounterRecords y calculateMachineBalance

export default function MachineBalancePage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 9, 1)); // October 1st, 2023
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 10, 5)); // November 5th, 2023
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [machineFilter, setMachineFilter] = useState<string>("all");
  const [machineBalances, setMachineBalances] = useState<MachineBalance[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [loadingMachines, setLoadingMachines] = useState<boolean>(true);

  type ApiLocation = {
    id: number;
    codigo: string;
    nombre_casino: string;
    ciudad: string;
    direccion: string;
    telefono: string;
    persona_encargada: string;
    estado: string;
  };

  // Ajusta el tipo Machine para que coincida con la estructura de tu API
  type ApiMachine = {
    id: string | number;
    codigo: string;
    activo: number;
    marca: string;
    modelo: string;
    numero_serie: string;
    denominacion: number;
    casino: string; // nombre del casino
  };

  // Cargar ubicaciones desde la API al montar el componente
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/listar-lugares');
        if (!response.ok) throw new Error("Error al obtener ubicaciones");
        const data: ApiLocation[] = await response.json();
        // Mapea los datos de la API al tipo Location usado en el frontend
        const mappedLocations: Location[] = data.map((item) => ({
          id: String(item.id),
          name: item.nombre_casino,
          code: item.codigo,
          city: item.ciudad,
          address: item.direccion,
          active: item.estado === "Activo",
          createdAt: "", // Si tienes fecha, ponla aquí
          updatedAt: "", // Si tienes fecha, ponla aquí
        }));
        setLocations(mappedLocations);
      } catch (error) {
        setLocations([]);
        console.error(error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Cargar máquinas desde la API
  useEffect(() => {
    const fetchMachines = async () => {
      setLoadingMachines(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/maquinas');
        if (!response.ok) throw new Error("Error al obtener máquinas");
        const data: ApiMachine[] = await response.json();
        // Mapea los datos de la API al tipo Machine usado en el frontend
        const mappedMachines: Machine[] = data.map((item) => ({
          id: String(item.id),
          brand: item.marca,
          model: item.modelo,
          serial: item.numero_serie,
          assetCode: item.codigo,
          denomination: item.denominacion,
          // Relaciona el casino por nombre, pero si tienes el id deberías usarlo
          locationId: locations.find(l => l.name === item.casino)?.id || "", 
          active: item.activo === 1,
          createdAt: "", // Si tienes fecha, ponla aquí
          updatedAt: "", // Si tienes fecha, ponla aquí
        }));
        setMachines(mappedMachines);
      } catch (error) {
        setMachines([]);
        console.error(error);
      } finally {
        setLoadingMachines(false);
      }
    };
    fetchMachines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]); // Espera a que locations esté cargado para mapear correctamente

  // Handle the export to CSV
  const handleExportCSV = () => {
    if (machineBalances.length === 0) return;
    
    const headers = [
      "Máquina",
      "Ubicación",
      "Fecha Inicio",
      "Fecha Fin",
      "IN Inicial",
      "IN Final",
      "OUT Inicial",
      "OUT Final",
      "Jackpot Total",
      "Billetero Total",
      "Créditos Jugados",
      "Dinero Jugado",
      "Ganancia Neta",
      "Denominación",
    ];
    
    const csvRows = [headers.join(',')];
    
    for (const balance of machineBalances) {
      const machine = machines.find(m => m.id === balance.machineId);
      if (!machine) continue;
      
      const locationName = getLocationName(machine.locationId);
      const machineName = getMachineName(balance.machineId);
      
      const row = [
        `"${machineName}"`,
        `"${locationName}"`,
        balance.startDate,
        balance.endDate,
        balance.initialIn,
        balance.finalIn,
        balance.initialOut,
        balance.finalOut,
        balance.totalJackpot,
        balance.totalBilletero,
        balance.playedCredits,
        balance.playedMoney.toFixed(2),
        balance.netProfit.toFixed(2),
        balance.denomination.toFixed(2),
      ];
      
      csvRows.push(row.join(','));
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `machine-balance-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get location name from id
  const getLocationName = (locationId: string): string => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : "Desconocida";
  };
  
  // Get machine name from id
  const getMachineName = (machineId: string): string => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return "Desconocida";
    
    return `${machine.brand} ${machine.model} (${machine.assetCode})`;
  };
  
  // Format date for display
  const formatDateString = (date?: Date) => {
    if (!date) return "Seleccionar fecha";
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  // Reemplaza la función handleProcesarBalance por esta versión:
  const handleProcesarBalance = async () => {
    if (!startDate || !endDate) return;

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Filtra máquinas según el filtro de ubicación
    const filteredMachines = machines.filter(
      machine => locationFilter === "all" || machine.locationId === locationFilter
    );

    // Filtra máquinas si hay una máquina seleccionada
    const machinesToProcess = machineFilter === "all"
      ? filteredMachines
      : filteredMachines.filter(m => m.id === machineFilter);

    if (machinesToProcess.length === 0) {
      setMachineBalances([]);
      return;
    }

    const balances: MachineBalance[] = [];

    for (const machine of machinesToProcess) {
      try {
        const casinoName = getLocationName(machine.locationId);
        const machineName = getMachineName(machine.id);

        const response = await fetch("http://127.0.0.1:8000/cuadre_maquina", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fecha_inicio: startDateStr,
            fecha_fin: endDateStr,
            casino: casinoName,
            maquina: machineName,
            id: machine.assetCode,
            denominacion: machine.denomination,
          }),
        });

        if (!response.ok) throw new Error("Error al procesar el balance");
        const result = await response.json();
        console.log("Respuesta backend:", result);

        // Si la respuesta tiene la forma { cuadres: [...] }
        if (Array.isArray(result.cuadres)) {
          for (const cuadre of result.cuadres) {
            balances.push({
              machineId: machine.id,
              startDate: cuadre.fecha_inicio,
              endDate: cuadre.fecha_fin,
              initialIn: cuadre.total_in ?? 0,
              finalIn: cuadre.total_in ?? 0,
              initialOut: cuadre.total_out ?? 0,
              finalOut: cuadre.total_out ?? 0,
              totalJackpot: cuadre.total_jackpot ?? 0,
              totalBilletero: cuadre.total_billetero ?? 0,
              playedCredits: 0,
              playedMoney: 0,
              netProfit: cuadre.utilidad ?? 0,
              denomination: machine.denomination ?? 0,
            });
          }
        } else {
          // Fallback por si la respuesta es un solo cuadre
          balances.push({
            machineId: machine.id,
            startDate: result.fecha_inicio ?? startDateStr,
            endDate: result.fecha_fin ?? endDateStr,
            initialIn: result.total_in ?? 0,
            finalIn: result.total_in ?? 0,
            initialOut: result.total_out ?? 0,
            finalOut: result.total_out ?? 0,
            totalJackpot: result.total_jackpot ?? 0,
            totalBilletero: result.total_billetero ?? 0,
            playedCredits: 0,
            playedMoney: 0,
            netProfit: result.utilidad ?? ((result.total_in ?? 0) - (result.total_out ?? 0)),
            denomination: machine.denomination ?? 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    setMachineBalances(balances);
  };
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Balance por Máquina</h1>
        <p className="text-muted-foreground">
          Consulta el balance de ganancias por máquina en un período específico
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? formatDateString(startDate) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? formatDateString(endDate) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) =>
                      date < (startDate || new Date()) ||
                      date > new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicación</label>
              <Select
                value={locationFilter}
                onValueChange={setLocationFilter}
                disabled={loadingLocations}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Machine Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Máquina</label>
              <Select
                value={machineFilter}
                onValueChange={setMachineFilter}
                disabled={loadingMachines}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las máquinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las máquinas</SelectItem>
                  {machines
                    .filter(
                      (machine) =>
                        locationFilter === "all" ||
                        machine.locationId === locationFilter
                    )
                    .map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.brand} {machine.model} ({machine.assetCode})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartDate(new Date(2023, 9, 1));
                setEndDate(new Date(2023, 10, 5));
                setLocationFilter("all");
                setMachineFilter("all");
                setMachineBalances([]);
              }}
            >
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
      
      {machineBalances.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Resultados{" "}
              <span className="ml-2 text-muted-foreground text-sm font-normal">
                ({formatDateString(startDate)} <ArrowRight className="inline h-3 w-3 mx-1" /> {formatDateString(endDate)})
              </span>
            </CardTitle>
            
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Fecha Inicial</TableHead>
                  <TableHead>Fecha Final</TableHead>
                  <TableHead className="text-right">IN Inicial</TableHead>
                  <TableHead className="text-right">IN Final</TableHead>
                  <TableHead className="text-right">OUT Inicial</TableHead>
                  <TableHead className="text-right">OUT Final</TableHead>
                  <TableHead className="text-right">Jackpot</TableHead>
                  <TableHead className="text-right">Billetero</TableHead>
                  <TableHead className="text-right">Créditos</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineBalances.map((balance) => {
                  const machine = machines.find(m => m.id === balance.machineId);
                  return (
                    <TableRow key={`${balance.machineId}-${balance.startDate}-${balance.endDate}`}>
                      <TableCell>
                        <div className="font-medium">{getMachineName(balance.machineId)}</div>
                        <div className="text-muted-foreground">{balance.machineId}</div>
                      </TableCell>
                      <TableCell>
                        {machine ? getLocationName(machine.locationId) : "Desconocida"}
                      </TableCell>
                      <TableCell>{balance.startDate}</TableCell>
                      <TableCell>{balance.endDate}</TableCell>
                      <TableCell className="text-right">{balance.initialIn.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.finalIn.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.initialOut.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.finalOut.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.totalJackpot.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.totalBilletero.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.playedCredits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={balance.netProfit >= 0 ? "success" : "destructive"}
                          className="justify-center w-24"
                        >
                          {formatCurrency(balance.netProfit)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}