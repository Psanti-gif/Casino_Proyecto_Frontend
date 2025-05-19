"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <h3 className="text-xl font-semibold">Ha ocurrido un error</h3>
        </div>
        <p className="max-w-md text-center text-muted-foreground">
          {error.message || "Ha ocurrido un error inesperado. Por favor, intenta de nuevo."}
        </p>
        <Button onClick={reset}>Intentar de nuevo</Button>
      </div>
    </div>
  )
}