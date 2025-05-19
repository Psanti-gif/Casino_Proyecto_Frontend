"use client"

import { useState } from "react"
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
import { PlusCircle, Search, Edit, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Location } from "@/types"
import { formatDate } from "@/lib/utils"

// Sample locations
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
  {
    id: "L-1004",
    name: "Gold Palace",
    code: "GP",
    city: "Biloxi",
    address: "321 Beach Blvd, Biloxi, MS",
    active: false,
    createdAt: "2023-01-04T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
  },
  {
    id: "L-1005",
    name: "Silver Moon",
    code: "SM",
    city: "Orlando",
    address: "555 Resort Way, Orlando, FL",
    active: true,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
  },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(sampleLocations)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    code: "",
    city: "",
    address: "",
    active: true,
  })
  
  const { toast } = useToast()
  
  // Filter locations based on search
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingLocation) {
      // Update existing location
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? {
                ...loc,
                ...newLocation,
                updatedAt: new Date().toISOString(),
              }
            : loc
        )
      )
      
      toast({
        title: "Ubicación actualizada",
        description: `La ubicación ${newLocation.name} ha sido actualizada correctamente.`,
      })
    } else {
      // Create new location
      const newLocationId = `L-${Math.floor(1000 + Math.random() * 9000)}`
      
      setLocations([
        ...locations,
        {
          ...newLocation,
          id: newLocationId,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Location,
      ])
      
      toast({
        title: "Ubicación creada",
        description: `La ubicación ${newLocation.name} ha sido creada correctamente.`,
      })
    }
    
    // Reset form and close dialog
    setNewLocation({
      name: "",
      code: "",
      city: "",
      address: "",
      active: true,
    })
    setEditingLocation(null)
    setIsDialogOpen(false)
  }
  
  // Edit location
  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setNewLocation({
      name: location.name,
      code: location.code,
      city: location.city,
      address: location.address,
      active: location.active,
    })
    setIsDialogOpen(true)
  }
  
  // Deactivate location
  const handleDeactivate = (locationId: string) => {
    setLocations(
      locations.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              active: false,
              updatedAt: new Date().toISOString(),
            }
          : loc
      )
    )
    
    toast({
      title: "Ubicación desactivada",
      description: "La ubicación ha sido desactivada correctamente.",
    })
  }
  
  // Activate location
  const handleActivate = (locationId: string) => {
    setLocations(
      locations.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              active: true,
              updatedAt: new Date().toISOString(),
            }
          : loc
      )
    )
    
    toast({
      title: "Ubicación activada",
      description: "La ubicación ha sido activada correctamente.",
    })
  }
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Ubicaciones</h1>
        <p className="text-muted-foreground">
          Gestiona las ubicaciones de los casinos
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, código o ciudad..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingLocation(null);
                setNewLocation({
                  name: "",
                  code: "",
                  city: "",
                  address: "",
                  active: true,
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Ubicación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? "Editar Ubicación" : "Crear Nueva Ubicación"}
                </DialogTitle>
                <DialogDescription>
                  {editingLocation
                    ? "Actualiza los detalles de la ubicación seleccionada"
                    : "Completa el formulario para registrar una nueva ubicación"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre
                    </label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                      Código
                    </label>
                    <Input
                      id="code"
                      value={newLocation.code}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, code: e.target.value })
                      }
                      required
                      maxLength={5}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    Ciudad
                  </label>
                  <Input
                    id="city"
                    value={newLocation.city}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, city: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Dirección
                  </label>
                  <Input
                    id="address"
                    value={newLocation.address}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, address: e.target.value })
                    }
                    required
                  />
                </div>
                
                {editingLocation && (
                  <div className="space-y-2">
                    <label htmlFor="active" className="text-sm font-medium">
                      Estado
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={newLocation.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewLocation({ ...newLocation, active: true })}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activa
                      </Button>
                      <Button
                        type="button"
                        variant={!newLocation.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewLocation({ ...newLocation, active: false })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Inactiva
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLocation ? "Guardar cambios" : "Crear ubicación"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron ubicaciones.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-muted-foreground">{location.id}</div>
                    </TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{location.address}</TableCell>
                    <TableCell>
                      {location.active ? (
                        <Badge variant="success">Activa</Badge>
                      ) : (
                        <Badge variant="destructive">Inactiva</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(location.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        
                        {location.active ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeactivate(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Desactivar</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleActivate(location.id)}
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