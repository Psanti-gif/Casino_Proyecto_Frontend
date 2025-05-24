"use client"

import { useEffect, useState } from "react"

export default function Footer() {
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [nit, setNit] = useState("")
  const [empresa, setEmpresa] = useState("CUADRE CASINO")

  // Información complementaria (lado derecho)
  const version = "1.0.0"
  const sede = "Medellín"
  const ambiente = "Producción"

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch("http://localhost:8000/configuracion")
        const data = await res.json()
        setDireccion(data.direccion || "")
        setTelefono(data.telefono || "")
        setNit(data.nit || "")
        setEmpresa(data.nombre_empresa || "CUADRE CASINO")
      } catch (error) {
        console.error("Error al cargar configuración del footer:", error)
      }
    }

    obtenerConfiguracion()
  }, [])

  return (
    <footer className="border-t mt-10 bg-background py-4 px-4 text-xs text-muted-foreground">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">

        {/* IZQUIERDA */}
        <div className="flex flex-col gap-1 text-left">
          <div className="flex flex-wrap gap-4">
            <span>📍 {direccion}</span>
            <span>📞 {telefono}</span>
            <span>🧾 NIT: {nit}</span>
            <span>✉️ soporte@empresa.com</span>
          </div>
          <span className="text-[10px]">
            &copy; {new Date().getFullYear()} {empresa}. Todos los derechos reservados.
          </span>
          <span className="text-[10px]">
            Este sistema es confidencial. Uso no autorizado está prohibido.
          </span>
        </div>

        {/* DERECHA */}
        <div className="hidden sm:flex flex-col items-end gap-1 text-[10px] text-muted-foreground text-right">
          <span>Versión: {version}</span>
          <span>Sede: {sede}</span>
          <span>Ambiente: {ambiente}</span>
        </div>

      </div>
    </footer>
  )
}

