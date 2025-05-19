"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CircleDollarSign, TrendingDown, TrendingUp, Bot as Slot } from "lucide-react";

// This would normally come from an API call
const getDashboardStats = () => {
  return {
    totalProfit: 156789.50,
    totalMachines: 52,
    profitIncrease: 12.5,
    averageMachineProfit: 3015.18,
    topLocation: "Casino Royal",
    topLocationProfit: 45678.90,
  };
};

export function DashboardStats() {
  const stats = getDashboardStats();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancia Total</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.profitIncrease > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">{stats.profitIncrease}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
                <span className="text-rose-500">{Math.abs(stats.profitIncrease)}%</span>
              </>
            )}
            <span className="ml-1">desde el mes pasado</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Máquinas</CardTitle>
          <Slot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMachines}</div>
          <div className="text-xs text-muted-foreground">
            En operación actualmente
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio por Máquina</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageMachineProfit)}</div>
          <div className="text-xs text-muted-foreground">
            Ganancia mensual promedio
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mejor Ubicación</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topLocation}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="text-emerald-500">{formatCurrency(stats.topLocationProfit)}</span>
            <span className="ml-1">de ganancia este mes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}