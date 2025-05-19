"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Filter, Calendar, Bot as Slot, DollarSign, Calculator } from "lucide-react"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CounterRecord, Location, Machine } from "@/types"
import { formatDate, calculateProfit } from "@/lib/utils"

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
    id: "C-1002",
    machineId: "M-1002",
    date: "2023-11-01",
    inValue: 80000,
    outValue: 55000,
    jackpotValue: 3000,
    billeteroValue: 12000,
    notes: "",
    createdAt: "2023-11-01T18:45:00Z",
    updatedAt: "2023-11-01T18:45:00Z",
    createdBy: "1",
  },
  {
    id: "C-1003",
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
  {
    id: "C-1004",
    machineId: "M-1001",
    date: "2023-11-02",
    inValue: 125690,
    outValue: 89750,
    jackpotValue: 5000,
    billeteroValue: 15000,
    notes: "",
    createdAt: "2023-11-02T18:30:00Z",
    updatedAt: "2023-11-02T18:30:00Z",
    createdBy: "1",
  },
  {
    id: "C-1005",
    machineId: "M-1002",
    date: "2023-11-02",
    inValue: 82340,
    outValue: 57890,
    jackpotValue: 3000,
    billeteroValue: 12000,
    notes: "",
    createdAt: "2023-11-02T18:45:00Z",
    updatedAt: "2023-11-02T18:45:00Z",
    createdBy: "1",
  },
];

// Get the previous day's counter record
const getPreviousCounter = (
  machineId: string,
  currentDate: string,
  records: CounterRecord[]
): CounterRecord | undefined => {
  // Sort records by date in descending order
  const sortedRecords = [...records]
    .filter((record) => record.machineId === machineId && record.date < currentDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return sortedRecords[0];
};

export default function CountersPage() {
  const [counterRecords, setCounterRecords] = useState<CounterRecord[]>(sampleCounterRecords)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterDate, setFilterDate] = useState<Date | undefined>(new Date())
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [newCounter, setNewCounter] = useState<Partial<CounterRecord>>({
    machineId: "",
    date: new Date().toISOString().split('T')[0],
    inValue: 0,
    outValue: 0,
    jackpotValue: 0,
    billeteroValue: 0,
    notes: "",
  })
  
  const [previousValues, setPreviousValues] = useState<{
    inValue: number;
    outValue: number;
  } | null>(null)
  
  const { toast } = useToast()
  
  // Format date string for filter display
  const formatDateString = (date?: Date) => {
    if (!date) return "Seleccionar fecha"
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  
  // Filter records based on date and location
  const filteredRecords = counterRecords.filter((record) => {
    const matchesDate = filterDate 
      ? record.date === filterDate.toISOString().split('T')[0]
      : true
      
    const matchesLocation = filterLocation === "all" 
      ? true 
      : sampleMachines.find(m => m.id === record.machineId)?.locationId === filterLocation
      
    return matchesDate && matchesLocation
  })
  
  // Get machine details
  const getMachineDetails = (machineId: string) => {
    const machine = sampleMachines.find((m) => m.id === machineId)
    if (!machine) return { name: "Desconocida", location: "Desconocida", denomination: 0.25 }
    
    const location = sampleLocations.find((l) => l.id === machine.locationId)
    return {
      name: `${machine.brand} ${machine.model} (${machine.assetCode})`,
      location: location ? location.name : "Desconocida",
      denomination: machine.denomination,
    }
  }
  
  // Calculate profit for a counter record
  const getProfitForRecord = (record: CounterRecord): number => {
    const machine = sampleMachines.find((m) => m.id === record.machineId)
    if (!machine) return 0
    
    // Get the previous day's counter
    const previousRecord = getPreviousCounter(record.machineId, record.date, counterRecords)
    
    if (!previousRecord) {
      // If no previous record, use the current values (for demo purposes)
      return calculateProfit(
        0,
        record.inValue,
        0,
        record.outValue,
        record.jackpotValue,
        record.billeteroValue,
        machine.denomination
      )
    }
    
    return calculateProfit(
      previousRecord.inValue,
      record.inValue,
      previousRecord.outValue,
      record.outValue,
      record.jackpotValue,
      record.billeteroValue,
      machine.denomination
    )
  }
  
  // Handle machine selection
  const handleMachineChange = (machineId: string) => {
    setNewCounter({ ...newCounter, machineId })
    
    // Set previous values based on the latest record for this machine
    const previousRecord = getPreviousCounter(
      machineId,
      newCounter.date || new Date().toISOString().split('T')[0],
      counterRecords
    )
    
    if (previousRecord) {
      setPreviousValues({
        inValue: previousRecord.inValue,
        outValue: previousRecord.outValue,
      })
    } else {
      setPreviousValues(null)
    }
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (newCounter.inValue === undefined || newCounter.outValue === undefined || 
        newCounter.jackpotValue === undefined || newCounter.billeteroValue === undefined) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos numéricos son obligatorios.",
      })
      return
    }
    
    if (previousValues && newCounter.inValue < previousValues.inValue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El valor IN no puede ser menor que el valor anterior.",
      })
      return
    }
    
    if (previousValues && newCounter.outValue < previousValues.outValue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El valor OUT no puede ser menor que el valor anterior.",
      })
      return
    }
    
    // Create new counter record
    const newCounterId = `C-${Math.floor(1000 + Math.random() * 9000)}`
    
    const newRecord: CounterRecord = {
      id: newCounterId,
      machineId: newCounter.machineId || "",
      date: newCounter.date || new Date().toISOString().split('T')[0],
      inValue: newCounter.inValue,
      outValue: newCounter.outValue,
      jackpotValue: newCounter.jackpotValue,
      billeteroValue: newCounter.billeteroValue,
      notes: newCounter.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "1", // User ID would come from auth context
    }
    
    setCounterRecords([...counterRecords, newRecord])
    
    toast({
      title: "Contador registrado",
      description: `Los valores del contador para la máquina se han registrado correctamente.`,
    })
    
    // Reset form and close dialog
    setNewCounter({
      machineId: "",
      date: new Date().toISOString().split('T')[0],
      inValue: 0,
      outValue: 0,
      jackpotValue: 0,
      billeteroValue: 0,
      notes: "",
    })
    setPreviousValues(null)
    setIsDialogOpen(false)
  }
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Contadores</h1>
        <p className="text-muted-foreground">
          Gestiona los contadores diarios de las máquinas
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Date filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {filterDate ? formatDateString(filterDate) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Location filter */}
          <Select
            value={filterLocation}
            onValueChange={setFilterLocation}
          >
            <SelectTrigger className="w-[240px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por ubicación" />
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Contador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Contador</DialogTitle>
                <DialogDescription>
                  Ingresa los valores de los contadores para la máquina seleccionada
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Machine selection */}
                <div className="space-y-2">
                  <label htmlFor="machine" className="text-sm font-medium flex items-center gap-1">
                    <Slot className="h-4 w-4" />
                    Máquina
                  </label>
                  <Select
                    value={newCounter.machineId}
                    onValueChange={handleMachineChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar máquina" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleMachines
                        .filter((machine) => machine.active)
                        .map((machine) => {
                          const machineDetails = getMachineDetails(machine.id);
                          return (
                            <SelectItem key={machine.id} value={machine.id}>
                              {machineDetails.name} - {machineDetails.location}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date selection */}
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newCounter.date
                          ? formatDateString(new Date(newCounter.date))
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newCounter.date ? new Date(newCounter.date) : undefined}
                        onSelect={(date) =>
                          setNewCounter({
                            ...newCounter,
                            date: date ? date.toISOString().split('T')[0] : undefined,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* IN value */}
                  <div className="space-y-2">
                    <label htmlFor="inValue" className="text-sm font-medium">
                      IN
                    </label>
                    <div className="relative">
                      <Input
                        id="inValue"
                        type="number"
                        value={newCounter.inValue || ""}
                        onChange={(e) =>
                          setNewCounter({
                            ...newCounter,
                            inValue: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                        min={previousValues ? previousValues.inValue : 0}
                      />
                      {previousValues && (
                        <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
                          Valor anterior: {previousValues.inValue.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* OUT value */}
                  <div className="space-y-2">
                    <label htmlFor="outValue" className="text-sm font-medium">
                      OUT
                    </label>
                    <div className="relative">
                      <Input
                        id="outValue"
                        type="number"
                        value={newCounter.outValue || ""}
                        onChange={(e) =>
                          setNewCounter({
                            ...newCounter,
                            outValue: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                        min={previousValues ? previousValues.outValue : 0}
                      />
                      {previousValues && (
                        <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
                          Valor anterior: {previousValues.outValue.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Jackpot value */}
                  <div className="space-y-2">
                    <label htmlFor="jackpotValue" className="text-sm font-medium">
                      JACKPOT
                    </label>
                    <Input
                      id="jackpotValue"
                      type="number"
                      value={newCounter.jackpotValue || ""}
                      onChange={(e) =>
                        setNewCounter({
                          ...newCounter,
                          jackpotValue: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      min={0}
                    />
                  </div>
                  
                  {/* Billetero value */}
                  <div className="space-y-2">
                    <label htmlFor="billeteroValue" className="text-sm font-medium">
                      BILLETERO
                    </label>
                    <Input
                      id="billeteroValue"
                      type="number"
                      value={newCounter.billeteroValue || ""}
                      onChange={(e) =>
                        setNewCounter({
                          ...newCounter,
                          billeteroValue: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      min={0}
                    />
                  </div>
                </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notas
                  </label>
                  <Textarea
                    id="notes"
                    value={newCounter.notes || ""}
                    onChange={(e) =>
                      setNewCounter({ ...newCounter, notes: e.target.value })
                    }
                    placeholder="Observaciones opcionales..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contadores {filterDate && `- ${formatDateString(filterDate)}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Máquina</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead className="text-right">IN</TableHead>
                <TableHead className="text-right">OUT</TableHead>
                <TableHead className="text-right">JACKPOT</TableHead>
                <TableHead className="text-right">BILLETERO</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron registros para la fecha seleccionada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => {
                  const machineDetails = getMachineDetails(record.machineId);
                  const profit = getProfitForRecord(record);
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{machineDetails.name}</div>
                        <div className="text-muted-foreground">{record.machineId}</div>
                      </TableCell>
                      <TableCell>{machineDetails.location}</TableCell>
                      <TableCell className="text-right">{record.inValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{record.outValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{record.jackpotValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{record.billeteroValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={profit >= 0 ? "success" : "destructive"} className="justify-center w-24">
                          {profit.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2
                          })}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}