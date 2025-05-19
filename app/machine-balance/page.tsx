"use client"

import { useState } from "react"
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
import { formatDate, formatCurrency, calculateProfit } from "@/lib/utils"
import { CounterRecord, Machine, Location, MachineBalance } from "@/types"

// Sample locations data
const sampleLocations: Location[] = [
  {
    id: "L-1001",
    name: "Casino Royal",
    code: "CR",
    city: "Las Vegas",
    address: "123 Main St, Las Vegas, NV",
    active: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "L-1002",
    name: "Fortune Club",
    code: "FC",
    city: "Atlantic City",
    address: "456 Boardwalk, Atlantic City, NJ",
    active: true,
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "L-1003",
    name: "Lucky Star",
    code: "LS",
    city: "Reno",
    address: "789 Casino Dr, Reno, NV",
    active: true,
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
];

// Sample machines data
const sampleMachines: Machine[] = [
  {
    id: "M-1001",
    brand: "IGT",
    model: "Game King",
    serial: "IGT-GK-12345",
    assetCode: "A-1001",
    denomination: 0.25,
    locationId: "L-1001",
    active: true,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "M-1002",
    brand: "Aristocrat",
    model: "Buffalo",
    serial: "ARI-BUF-67890",
    assetCode: "A-1002",
    denomination: 0.1,
    locationId: "L-1002",
    active: true,
    createdAt: "2023-02-10T10:15:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
  },
  {
    id: "M-1003",
    brand: "Scientific Games",
    model: "Zeus",
    serial: "SG-ZEUS-45678",
    assetCode: "A-1003",
    denomination: 0.05,
    locationId: "L-1001",
    active: true,
    createdAt: "2023-03-05T09:20:00Z",
    updatedAt: "2023-03-05T09:20:00Z",
  },
];

// Sample counter records
const sampleCounterRecords: CounterRecord[] = [
  {
    id: "C-1001",
    machineId: "M-1001",
    date: "2023-10-01",
    inValue: 120000,
    outValue: 80000,
    jackpotValue: 0,
    billeteroValue: 0,
    createdAt: "2023-10-01T18:30:00Z",
    updatedAt: "2023-10-01T18:30:00Z",
    createdBy: "1",
  },
  {
    id: "C-1002",
    machineId: "M-1001",
    date: "2023-11-01",
    inValue: 125000,
    outValue: 85000,
    jackpotValue: 5000,
    billeteroValue: 15000,
    notes: "Funcionamiento normal",
    createdAt: "2023-11-01T18:30:00Z",
    updatedAt: "2023-11-01T18:30:00Z",
    createdBy: "1",
  },
  {
    id: "C-1003",
    machineId: "M-1001",
    date: "2023-11-05",
    inValue: 127500,
    outValue: 87500,
    jackpotValue: 2000,
    billeteroValue: 8000,
    createdAt: "2023-11-05T18:30:00Z",
    updatedAt: "2023-11-05T18:30:00Z",
    createdBy: "1",
  },
  {
    id: "C-1004",
    machineId: "M-1002",
    date: "2023-10-01",
    inValue: 75000,
    outValue: 50000,
    jackpotValue: 0,
    billeteroValue: 0,
    createdAt: "2023-10-01T18:45:00Z",
    updatedAt: "2023-10-01T18:45:00Z",
    createdBy: "1",
  },
  {
    id: "C-1005",
    machineId: "M-1002",
    date: "2023-11-01",
    inValue: 80000,
    outValue: 55000,
    jackpotValue: 3000,
    billeteroValue: 12000,
    createdAt: "2023-11-01T18:45:00Z",
    updatedAt: "2023-11-01T18:45:00Z",
    createdBy: "1",
  },
  {
    id: "C-1006",
    machineId: "M-1003",
    date: "2023-10-01",
    inValue: 55000,
    outValue: 35000,
    jackpotValue: 0,
    billeteroValue: 0,
    createdAt: "2023-10-01T19:00:00Z",
    updatedAt: "2023-10-01T19:00:00Z",
    createdBy: "1",
  },
  {
    id: "C-1007",
    machineId: "M-1003",
    date: "2023-11-01",
    inValue: 60000,
    outValue: 40000,
    jackpotValue: 2500,
    billeteroValue: 8000,
    notes: "Se realizó mantenimiento preventivo",
    createdAt: "2023-11-01T19:00:00Z",
    updatedAt: "2023-11-01T19:00:00Z",
    createdBy: "1",
  },
];

// Function to calculate machine balance
const calculateMachineBalance = (
  machineId: string,
  startDate: string,
  endDate: string,
  counters: CounterRecord[],
  machines: Machine[]
): MachineBalance | null => {
  // Find the machine
  const machine = machines.find(m => m.id === machineId);
  if (!machine) return null;
  
  // Get counter records for this machine within the date range
  const machineCounters = counters
    .filter(c => c.machineId === machineId && c.date >= startDate && c.date <= endDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (machineCounters.length < 2) return null;
  
  // Get first and last counter
  const firstCounter = machineCounters[0];
  const lastCounter = machineCounters[machineCounters.length - 1];
  
  // Calculate total jackpot and billetero
  let totalJackpot = 0;
  let totalBilletero = 0;
  
  machineCounters.forEach(counter => {
    totalJackpot += counter.jackpotValue;
    totalBilletero += counter.billeteroValue;
  });
  
  // Calculate played credits and money
  const playedCredits = (lastCounter.inValue - firstCounter.inValue) - 
                       (lastCounter.outValue - firstCounter.outValue);
  
  const playedMoney = playedCredits * machine.denomination;
  
  // Calculate net profit
  const netProfit = playedMoney - totalJackpot - totalBilletero;
  
  return {
    machineId,
    startDate,
    endDate,
    initialIn: firstCounter.inValue,
    finalIn: lastCounter.inValue,
    initialOut: firstCounter.outValue,
    finalOut: lastCounter.outValue,
    totalJackpot,
    totalBilletero,
    playedCredits,
    playedMoney,
    netProfit,
    denomination: machine.denomination,
  };
};

export default function MachineBalancePage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 9, 1)); // October 1st, 2023
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 10, 5)); // November 5th, 2023
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [machineFilter, setMachineFilter] = useState<string>("all");
  const [machineBalances, setMachineBalances] = useState<MachineBalance[]>([]);
  
  // Calculate balances when filters change
  const calculateBalances = () => {
    if (!startDate || !endDate) return;
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Filter machines based on location filter
    const filteredMachines = sampleMachines.filter(
      machine => locationFilter === "all" || machine.locationId === locationFilter
    );
    
    // Filter machines further if a specific machine is selected
    const machinesToProcess = machineFilter === "all" 
      ? filteredMachines 
      : filteredMachines.filter(m => m.id === machineFilter);
    
    // Calculate balance for each machine
    const balances: MachineBalance[] = [];
    
    for (const machine of machinesToProcess) {
      const balance = calculateMachineBalance(
        machine.id,
        startDateStr,
        endDateStr,
        sampleCounterRecords,
        sampleMachines
      );
      
      if (balance) {
        balances.push(balance);
      }
    }
    
    setMachineBalances(balances);
  };
  
  // Get location name from id
  const getLocationName = (locationId: string): string => {
    const location = sampleLocations.find(l => l.id === locationId);
    return location ? location.name : "Desconocida";
  };
  
  // Get machine name from id
  const getMachineName = (machineId: string): string => {
    const machine = sampleMachines.find(m => m.id === machineId);
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
      const machine = sampleMachines.find(m => m.id === balance.machineId);
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {sampleLocations.map((location) => (
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las máquinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las máquinas</SelectItem>
                  {sampleMachines
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
            
            <Button size="sm" onClick={calculateBalances}>
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
                  <TableHead className="text-right">IN Inicial</TableHead>
                  <TableHead className="text-right">IN Final</TableHead>
                  <TableHead className="text-right">OUT Inicial</TableHead>
                  <TableHead className="text-right">OUT Final</TableHead>
                  <TableHead className="text-right">Créditos</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineBalances.map((balance) => {
                  const machine = sampleMachines.find(m => m.id === balance.machineId);
                  return (
                    <TableRow key={balance.machineId}>
                      <TableCell>
                        <div className="font-medium">{getMachineName(balance.machineId)}</div>
                        <div className="text-muted-foreground">{balance.machineId}</div>
                      </TableCell>
                      <TableCell>
                        {machine ? getLocationName(machine.locationId) : "Desconocida"}
                      </TableCell>
                      <TableCell className="text-right">{balance.initialIn.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.finalIn.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.initialOut.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{balance.finalOut.toLocaleString()}</TableCell>
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