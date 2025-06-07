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
  const [divisa, setDivisa] = useState("")
  const [logoPreview, setLogoPreview] = useState("")
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null)
  const [colorPrimario, setColorPrimario] = useState("#1d4ed8")
  const [colorFondo, setColorFondo] = useState("#ffffff")
  const [modoMantenimiento, setModoMantenimiento] = useState(false)

  const [marcas, setMarcas] = useState("")
  const [modelos, setModelos] = useState("")

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
        setDivisa(data.divisa || "")
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

  const guardarConfiguracion = async () => {
    try {
      const formData = new FormData()
      formData.append("nombre_empresa", nombreApp)
      formData.append("telefono", telefono)
      formData.append("direccion", direccion)
      formData.append("nit", nit)
      formData.append("correo", correo)
      formData.append("divisa", divisa)
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

  const guardarMarcasYModelos = async () => {
    try {
      const formData = new FormData()
      formData.append("nombre_empresa", nombreApp) // requerido en backend
      formData.append("telefono", telefono)
      formData.append("direccion", direccion)
      formData.append("nit", nit)
      formData.append("correo", correo)
      formData.append("divisa", divisa)
      formData.append("color_primario", colorPrimario)
      formData.append("color_fondo", colorFondo)
      formData.append("modo_mantenimiento", String(modoMantenimiento))
      formData.append("marcas", marcas)
      formData.append("modelos", modelos)
      if (archivoLogo) {
        formData.append("logo", archivoLogo)
      }

      const res = await fetch("http://localhost:8000/configuracion", {
        method: "PUT",
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert("Marcas y modelos agregados correctamente")
        setMarcas("")
        setModelos("")
      } else {
        alert("Error al guardar marcas/modelos")
      }
    } catch (error) {
      alert("Error al conectar con el servidor")
      console.error(error)
    }
  }

  if (cargando) return <p className="p-4">Cargando configuración...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8">
      <Button variant="outline" onClick={() => router.push("/main")}>← Volver</Button>

      {/* Formulario principal de configuración */}
      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div><Label>NIT</Label><Input value={nit} onChange={(e) => setNit(e.target.value)} required /></div>
          <div><Label>Nombre de la Empresa</Label><Input value={nombreApp} onChange={(e) => setNombreApp(e.target.value)} required /></div>
          <div><Label>Divisa</Label><Input value={divisa} onChange={(e) => setDivisa(e.target.value)} placeholder="Ej: COP, USD, EUR" maxLength={10} /></div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Teléfono</Label>
              <Input
                value={telefono}
                onChange={(e) => {
                  const valor = e.target.value
                  if (/^\d{0,10}$/.test(valor)) {
                    setTelefono(valor)
                  }
                }}
                placeholder="Máximo 10 dígitos"
                inputMode="numeric"
              />
            </div>
            <div><Label>Dirección</Label><Input value={direccion} onChange={(e) => setDireccion(e.target.value)} /></div>
          </div>

          <div><Label>Correo</Label><Input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@empresa.com" /></div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Color Primario</Label><Input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} /></div>
            <div><Label>Color de Fondo</Label><Input type="color" value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} /></div>
          </div>

          <div>
            <Label>Logo</Label>
            <Input type="file" accept="image/png, image/jpeg" onChange={(e) => {
              const archivo = e.target.files?.[0]
              if (archivo) {
                setArchivoLogo(archivo)
                const preview = URL.createObjectURL(archivo)
                setLogoPreview(preview)
              }
            }} />
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm">Vista previa:</Label>
            {logoPreview && <img src={logoPreview} alt="Logo" className="h-10" />}
          </div>

          <div className="flex items-center justify-between border p-3 rounded">
            <div>
              <h4 className="font-medium">Modo Mantenimiento</h4>
              <p className="text-sm text-muted-foreground">
                Al activarlo, el sistema se desactiva temporalmente.<br /><br />
                Para desactivarlo, visita:<br />
                <code>http://localhost:8000/modo-mantenimiento-off?clave=admin123</code>
              </p>
            </div>
            <Switch checked={modoMantenimiento} onCheckedChange={setModoMantenimiento} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/main")}>Cancelar</Button>
            <Button onClick={guardarConfiguracion}>Guardar Configuración</Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulario separado para agregar marcas y modelos */}
      <Card>
        <CardHeader className="text-primary">
          <CardTitle>Agregar Marcas y Modelos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Marcas de Máquinas</Label>
            <Input
              value={marcas}
              onChange={(e) => setMarcas(e.target.value)}
              placeholder="Ej: IGT, Novomatic"
            />
          </div>
          <div>
            <Label>Modelos de Máquinas</Label>
            <Input
              value={modelos}
              onChange={(e) => setModelos(e.target.value)}
              placeholder="Ej: S2000, Game King"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={guardarMarcasYModelos}>Guardar Marcas y Modelos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
