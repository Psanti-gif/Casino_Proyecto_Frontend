"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function DashboardCharts() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Dynamically set the colors based on the theme
  const isDark = theme === 'dark';
  const textColor = isDark ? 'rgb(241, 245, 249)' : 'rgb(15, 23, 42)';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)';
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const lineData = {
    labels: months.slice(0, 6),
    datasets: [
      {
        label: 'Ganancia Mensual',
        data: [12500, 15600, 14200, 16800, 18900, 21300],
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsla(var(--chart-1), 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const barData = {
    labels: ['Casino Royal', 'Fortune Club', 'Lucky Star', 'Gold Palace', 'Silver Moon'],
    datasets: [
      {
        label: 'Ganancia por Casino',
        data: [45678.90, 36789.12, 29876.54, 26543.21, 18901.23],
        backgroundColor: [
          'hsla(var(--chart-1), 0.8)',
          'hsla(var(--chart-2), 0.8)',
          'hsla(var(--chart-3), 0.8)',
          'hsla(var(--chart-4), 0.8)',
          'hsla(var(--chart-5), 0.8)',
        ],
        borderColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
          'hsl(var(--chart-4))',
          'hsl(var(--chart-5))',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ganancia</CardTitle>
          <CardDescription>Tendencia de ganancia durante los últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <Line data={lineData} options={chartOptions} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ganancia por Casino</CardTitle>
          <CardDescription>Distribución de ganancias por casino en el último mes</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <Bar data={barData} options={chartOptions} />
        </CardContent>
      </Card>
    </>
  );
}