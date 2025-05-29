'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/datepicker'
import axios from 'axios'
import { format } from 'date-fns'

interface Casino {
  id: string
  nombre: string
}

interface Totales {
  IN: number
  OUT: number
  JACKPOT: number
  BILLETERO: number
}

interface Reporte {
  casino: string
  rango_fechas: {
    desde: string
    hasta: string
  }
  totales: Totales
  utilidad: number
  archivo_pdf: string
  archivo_excel: string
}

export default function BalancePorCasinoPage() {
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [casinoSeleccionado, setCasinoSeleccionado] = useState<string>('')
  const [desde, setDesde] = useState<Date | undefined>()
  const [hasta, setHasta] = useState<Date | undefined>()
  const [reporte, setReporte] = useState<Reporte | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8000/casinos')
      .then(res => {
        const data = res.data.casinos
        const lista = Object.entries(data).map(([id, casino]: any) => ({
          id,
          nombre: casino.nombre
        }))
        setCasinos(lista)
      })
      .catch(err => console.error('Error cargando casinos:', err))
  }, [])

  const generarReporte = async () => {
    if (!casinoSeleccionado || !desde || !hasta) return
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/cuadre/${casinoSeleccionado}`, {
        params: {
          desde: format(desde, 'yyyy-MM-dd'),
          hasta: format(hasta, 'yyyy-MM-dd')
        }
      })
      setReporte(response.data)
    } catch (error) {
      console.error('Error generando reporte:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance por Casino</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Casino</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={casinoSeleccionado}
                onChange={e => setCasinoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione...</option>
                {casinos.map(casino => (
                  <option key={casino.id} value={casino.id}>{casino.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Desde</label>
              <DatePicker 
                 date={desde}
                  onChange={(date) => setDesde(date ?? undefined)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hasta</label>
              <DatePicker 
                  date={hasta}
                    onChange={(date) => setHasta(date ?? undefined)} />
            </div>
            <div className="flex items-end">
              <Button onClick={generarReporte} disabled={loading}>
                {loading ? 'Cargando...' : 'Generar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reporte && (
        <Card>
          <CardHeader>
            <CardTitle>Reporte Generado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Casino:</strong> {reporte.casino}</p>
            <p><strong>Desde:</strong> {reporte.rango_fechas.desde}</p>
            <p><strong>Hasta:</strong> {reporte.rango_fechas.hasta}</p>
            <p><strong>Totales:</strong></p>
            <ul className="ml-4 list-disc">
              <li>IN: {reporte.totales.IN}</li>
              <li>OUT: {reporte.totales.OUT}</li>
              <li>JACKPOT: {reporte.totales.JACKPOT}</li>
              <li>BILLETERO: {reporte.totales.BILLETERO}</li>
            </ul>
            <p><strong>Utilidad:</strong> {reporte.utilidad}</p>
            <div className="flex gap-4">
              <a
                href={`http://localhost:8000/${reporte.archivo_excel}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">Descargar Excel</Button>
              </a>
              <a
                href={`http://localhost:8000/${reporte.archivo_pdf}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">Descargar PDF</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
