"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { PlusCircle, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Machine, Location } from "@/types"
import { generateId } from "@/lib/utils"

// Sample data for machines
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
  {
    id: "M-1004",
    brand: "Konami",
    model: "Fortune Stacks",
    serial: "KON-FS-34567",
    assetCode: "A-1004",
    denomination: 0.5,
    locationId: "L-1003",
    active: false,
    createdAt: "2023-04-20T13:40:00Z",
    updatedAt: "2023-10-05T11:30:00Z",
  },
  {
    id: "M-1005",
    brand: "IGT",
    model: "Wheel of Fortune",
    serial: "IGT-WOF-23456",
    assetCode: "A-1005",
    denomination: 1,
    locationId: "L-1002",
    active: true,
    createdAt: "2023-05-15T11:10:00Z",
    updatedAt: "2023-05-15T11:10:00Z",
  },
];

// Sample locations for dropdown
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

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>(sampleMachines);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    brand: "",
    model: "",
    serial: "",
    assetCode: "",
    denomination: 0.25,
    locationId: "",
    active: true,
  });
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Filter machines based on search query and location filter
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = 
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.assetCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || machine.locationId === locationFilter;
    
    return matchesSearch && matchesLocation;
  });
  
  // Handle form submission for new or edited machine
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMachine) {
      // Update existing machine
      setMachines(
        machines.map((m) =>
          m.id === editingMachine.id
            ? {
                ...m,
                ...newMachine,
                updatedAt: new Date().toISOString(),
              }
            : m
        )
      );
      
      toast({
        title: "Máquina actualizada",
        description: `La máquina ${newMachine.assetCode} ha sido actualizada correctamente.`,
      });
    } else {
      // Create new machine
      const newMachineId = `M-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setMachines([
        ...machines,
        {
          ...newMachine,
          id: newMachineId,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Machine,
      ]);
      
      toast({
        title: "Máquina creada",
        description: `La máquina ${newMachine.assetCode} ha sido creada correctamente.`,
      });
    }
    
    // Reset form and close dialog
    setNewMachine({
      brand: "",
      model: "",
      serial: "",
      assetCode: "",
      denomination: 0.25,
      locationId: "",
      active: true,
    });
    setEditingMachine(null);
    setIsDialogOpen(false);
  };
  
  // Edit a machine
  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setNewMachine({
      brand: machine.brand,
      model: machine.model,
      serial: machine.serial,
      assetCode: machine.assetCode,
      denomination: machine.denomination,
      locationId: machine.locationId,
      active: machine.active,
    });
    setIsDialogOpen(true);
  };
  
  // Delete a machine (for demo, we'll just deactivate it)
  const handleDelete = (machineId: string) => {
    setMachines(
      machines.map((m) =>
        m.id === machineId
          ? {
              ...m,
              active: false,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    
    toast({
      title: "Máquina desactivada",
      description: `La máquina ha sido desactivada correctamente.`,
    });
  };
  
  // Activate a machine
  const handleActivate = (machineId: string) => {
    setMachines(
      machines.map((m) =>
        m.id === machineId
          ? {
              ...m,
              active: true,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    
    toast({
      title: "Máquina activada",
      description: `La máquina ha sido activada correctamente.`,
    });
  };
  
  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = sampleLocations.find((l) => l.id === locationId);
    return location ? location.name : "Desconocido";
  };
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Máquinas</h1>
        <p className="text-muted-foreground">
          Gestiona las máquinas registradas en el sistema
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID, marca, modelo..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1.5">
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger className="w-[180px]">
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
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingMachine(null);
                setNewMachine({
                  brand: "",
                  model: "",
                  serial: "",
                  assetCode: "",
                  denomination: 0.25,
                  locationId: "",
                  active: true,
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Máquina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingMachine ? "Editar Máquina" : "Crear Nueva Máquina"}
                </DialogTitle>
                <DialogDescription>
                  {editingMachine
                    ? "Actualiza los detalles de la máquina seleccionada"
                    : "Completa el formulario para registrar una nueva máquina"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="brand" className="text-sm font-medium">
                      Marca
                    </label>
                    <Input
                      id="brand"
                      value={newMachine.brand}
                      onChange={(e) =>
                        setNewMachine({ ...newMachine, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-medium">
                      Modelo
                    </label>
                    <Input
                      id="model"
                      value={newMachine.model}
                      onChange={(e) =>
                        setNewMachine({ ...newMachine, model: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="serial" className="text-sm font-medium">
                      Número de Serie
                    </label>
                    <Input
                      id="serial"
                      value={newMachine.serial}
                      onChange={(e) =>
                        setNewMachine({ ...newMachine, serial: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="assetCode" className="text-sm font-medium">
                      Código de Activo
                    </label>
                    <Input
                      id="assetCode"
                      value={newMachine.assetCode}
                      onChange={(e) =>
                        setNewMachine({ ...newMachine, assetCode: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="denomination" className="text-sm font-medium">
                      Denominación
                    </label>
                    <Select
                      value={newMachine.denomination?.toString()}
                      onValueChange={(value) =>
                        setNewMachine({
                          ...newMachine,
                          denomination: parseFloat(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar denominación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.01">$0.01</SelectItem>
                        <SelectItem value="0.05">$0.05</SelectItem>
                        <SelectItem value="0.1">$0.10</SelectItem>
                        <SelectItem value="0.25">$0.25</SelectItem>
                        <SelectItem value="0.5">$0.50</SelectItem>
                        <SelectItem value="1">$1.00</SelectItem>
                        <SelectItem value="5">$5.00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Ubicación
                    </label>
                    <Select
                      value={newMachine.locationId}
                      onValueChange={(value) =>
                        setNewMachine({ ...newMachine, locationId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {editingMachine && (
                  <div className="space-y-2">
                    <label htmlFor="active" className="text-sm font-medium">
                      Estado
                    </label>
                    <Select
                      value={newMachine.active ? "active" : "inactive"}
                      onValueChange={(value) =>
                        setNewMachine({
                          ...newMachine,
                          active: value === "active",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activa</SelectItem>
                        <SelectItem value="inactive">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMachine ? "Guardar cambios" : "Crear máquina"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Marca / Modelo</TableHead>
                <TableHead>Denominación</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron máquinas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>{machine.id}</TableCell>
                    <TableCell>{machine.assetCode}</TableCell>
                    <TableCell>
                      <div className="font-medium">{machine.brand}</div>
                      <div className="text-muted-foreground">{machine.model}</div>
                    </TableCell>
                    <TableCell>${machine.denomination.toFixed(2)}</TableCell>
                    <TableCell>{getLocationName(machine.locationId)}</TableCell>
                    <TableCell>
                      {machine.active ? (
                        <Badge variant="success">Activa</Badge>
                      ) : (
                        <Badge variant="destructive">Inactiva</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(machine)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        
                        {machine.active ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(machine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Desactivar</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleActivate(machine.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Activar</span>
                          </Button>
                        )}
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