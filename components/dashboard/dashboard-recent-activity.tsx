"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// This would normally come from an API call
const recentActivities = [
  {
    id: "act-1",
    type: "counter",
    machineId: "M-1001",
    machineName: "Lucky 777",
    location: "Casino Royal",
    date: "2023-11-15",
    values: {
      in: 125690,
      out: 89750,
      jackpot: 5000,
      billetero: 15000
    },
    profit: 15940,
    user: "Juan Pérez"
  },
  {
    id: "act-2",
    type: "counter",
    machineId: "M-1002",
    machineName: "Fortune Wheel",
    location: "Casino Royal",
    date: "2023-11-15",
    values: {
      in: 98460,
      out: 65230,
      jackpot: 3000,
      billetero: 12000
    },
    profit: 18230,
    user: "Ana Gómez"
  },
  {
    id: "act-3",
    type: "machine",
    action: "updated",
    machineId: "M-1005",
    machineName: "Gold Rush",
    location: "Fortune Club",
    date: "2023-11-14",
    changes: ["Cambio de denominación"],
    user: "Carlos Ramírez"
  },
  {
    id: "act-4",
    type: "counter",
    machineId: "M-1003",
    machineName: "Diamond King",
    location: "Lucky Star",
    date: "2023-11-14",
    values: {
      in: 78920,
      out: 52180,
      jackpot: 2500,
      billetero: 8000
    },
    profit: 16240,
    user: "María López"
  },
  {
    id: "act-5",
    type: "location",
    action: "created",
    locationName: "Golden Palace",
    city: "Miami, FL",
    date: "2023-11-13",
    user: "Juan Pérez"
  }
];

export function DashboardRecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Las últimas acciones registradas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Badge variant={activity.type === 'counter' ? 'default' : activity.type === 'machine' ? 'secondary' : 'outline'}>
                    {activity.type === 'counter' ? 'Contador' : activity.type === 'machine' ? 'Máquina' : 'Ubicación'}
                  </Badge>
                  
                  <span className="font-medium">
                    {activity.type === 'counter' && `${activity.machineName} (#${activity.machineId})`}
                    {activity.type === 'machine' && `${activity.machineName} (#${activity.machineId}) ${activity.action}`}
                    {activity.type === 'location' && `${activity.locationName} ${activity.action}`}
                  </span>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  {formatDate(activity.date)}
                </div>
              </div>
              
              <div className="text-sm">
                {activity.type === 'counter' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">IN</span>
                      <span>{activity.values.in.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">OUT</span>
                      <span>{activity.values.out.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">JACKPOT</span>
                      <span>{activity.values.jackpot.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">BILLETERO</span>
                      <span>{activity.values.billetero.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                {activity.type === 'machine' && (
                  <span className="text-muted-foreground">
                    {activity.changes.join(", ")}
                  </span>
                )}
                
                {activity.type === 'location' && (
                  <span className="text-muted-foreground">
                    {activity.city}
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm">
                <div className="text-muted-foreground">
                  Registrado por {activity.user}
                </div>
                {activity.type === 'counter' && (
                  <div className="ml-auto">
                    <span className="font-medium">Ganancia: </span>
                    <span className={activity.profit > 0 ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(activity.profit)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}