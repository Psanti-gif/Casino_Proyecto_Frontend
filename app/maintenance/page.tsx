"use client"
import { useEffect, useState } from "react"

export default function MaintenancePage() {
  const [nombreEmpresa, setNombreEmpresa] = useState("")
  const [colorPrimario, setColorPrimario] = useState("#1d4ed8")

  useEffect(() => {
    fetch("http://localhost:8000/configuracion")
      .then(res => res.json())
      .then(data => {
        setNombreEmpresa(data.nombre_empresa || "CUADRE CASINO")
        setColorPrimario(data.color_primario || "#1d4ed8")
      })
      .catch(() => {
        setNombreEmpresa("CUADRE CASINO")
        setColorPrimario("#1d4ed8")
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gray-100">
      <div className="animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke={colorPrimario}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4" style={{ color: colorPrimario }}>
        {nombreEmpresa} está en mantenimiento
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Estamos trabajando en mejoras para brindarte una mejor experiencia. Por favor vuelve a intentarlo más tarde.
      </p>
    </div>
  )
}
