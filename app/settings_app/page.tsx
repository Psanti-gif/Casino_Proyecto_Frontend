"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"

export default function ConfiguracionPage() {
  const [nombreApp, setNombreApp] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [nit, setNit] = useState("")
  const [correo, setCorreo] = useState("")
  const [divisa, setDivisa] = useState("") // Nuevo estado para la divisa
  const [logoPreview, setLogoPreview] = useState("")
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null)
  const [colorPrimario, setColorPrimario] = useState("#1d4ed8")
  const [colorFondo, setColorFondo] = useState("#ffffff")
  const [modoMantenimiento, setModoMantenimiento] = useState(false)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch("http://localhost:8000/configuracion")
        const data = await res.json()
        setNombreApp(data.nombre_empresa || "")
        setTelefono(data.telefono || "")
        setDireccion(data.direccion || "")
        setNit(data.nit || "")
        setCorreo(data.correo || "")
        setDivisa(data.divisa || "") // Cargar divisa si existe
        setColorPrimario(data.color_primario || "#1d4ed8")
        setColorFondo(data.color_fondo || "#ffffff")
        setLogoPreview(`http://localhost:8000${data.logo_url || ""}`)
        setModoMantenimiento(data.modo_mantenimiento || false)
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
      formData.append("nombre_empresa", nombreApp)
      formData.append("telefono", telefono)
      formData.append("direccion", direccion)
      formData.append("nit", nit)
      formData.append("correo", correo)
      formData.append("divisa", divisa) // Guardar divisa
      formData.append("color_primario", colorPrimario)
      formData.append("color_fondo", colorFondo)
      formData.append("modo_mantenimiento", String(modoMantenimiento))
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
        <CardHeader className="text-primary">
          <CardTitle>Configuración del sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label>NIT</Label>
            <Input value={nit} onChange={(e) => setNit(e.target.value)} required />
          </div>

          <div>
            <Label>Nombre de la Empresa</Label>
            <Input value={nombreApp} onChange={(e) => setNombreApp(e.target.value)} required />
          </div>

          <div>
            <Label>Divisa</Label>
            <Input
              value={divisa}
              onChange={(e) => setDivisa(e.target.value)}
              placeholder="Ej: COP, USD, EUR"
              maxLength={10}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@empresa.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Color Primario</Label>
              <Input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} />
            </div>
            <div>
              <Label>Color de Fondo</Label>
              <Input type="color" value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} />
            </div>
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

          <div className="flex items-center justify-between border p-3 rounded">
            <div>
              <h4 className="font-medium">Modo Mantenimiento</h4>
              <p className="text-sm text-muted-foreground">
                Al activarlo, el sistema se desactiva temporalmente.
                <br /><br /> 
                Para desactivarlo, debes hacer una petecion a http://localhost:8000/modo-mantenimiento-off?clave=admin123
                <br /><br />O poner ("modo_mantenimiento": false) en Json de configuracion.
              </p>
            </div>
            <Switch checked={modoMantenimiento} onCheckedChange={setModoMantenimiento} />
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
