"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"

export default function ConfiguracionPage() {
  const [nombreApp, setNombreApp] = useState("")
  const [logoPreview, setLogoPreview] = useState("")
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch("http://localhost:8000/configuracion")
        const data = await res.json()
        setNombreApp(data.nombre_aplicacion)
        setLogoPreview(`http://localhost:8000${data.logo_url}`)
      } catch (error) {
        console.error("Error al cargar configuración:", error)
      } finally {
        setCargando(false)
      }
    }

    obtenerConfiguracion()
  }, [])

  const guardarCambios = async () => {
    try {
      const formData = new FormData()
      formData.append("nombre_aplicacion", nombreApp)
      if (archivoLogo) {
        formData.append("logo", archivoLogo)
      }

      const res = await fetch("http://localhost:8000/configuracion", {
        method: "PUT",
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.mensaje || "Configuración guardada correctamente")
        window.location.reload()
      } else {
        alert("Error: " + data.detail)
      }
    } catch (error) {
      alert("No se pudo guardar la configuración")
      console.error(error)
    }
  }

  if (cargando) return <p className="p-4">Cargando configuración...</p>

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/main")}
      >
        ← Volver
      </Button>
  
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label>Nombre de la Aplicación</Label>
            <Input
              value={nombreApp}
              onChange={(e) => setNombreApp(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Logo</Label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const archivo = e.target.files?.[0]
                if (archivo) {
                  setArchivoLogo(archivo)
                  const preview = URL.createObjectURL(archivo)
                  setLogoPreview(preview)
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm">Vista previa:</Label>
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-10" />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/main")}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
