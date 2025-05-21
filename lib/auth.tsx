"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Define the structure of the user object
export interface User {
  id: string
  username: string
  role: 'Admin' | 'Support' | 'Operator'
  name: string
}

// Define the structure of the auth context
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem('casinoUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)

    if (
      !storedUser &&
      !['/login', '/users/recuperar'].includes(pathname) &&
      !loading
    ) {
      router.push('/login')
    }
    
  }, [pathname, router, loading])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)

      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre_usuario: username,
          contrasena: password
        })
      })

      if (!res.ok) {
        console.error("Login fallido:", await res.json())
        return false
      }

      const data = await res.json()

      const user: User = {
        id: String(data.id), // ✅ ID real recibido del backend
        username: username,
        name: data.nombre_completo,
        role: data.rol
      }

      setUser(user)
      localStorage.setItem("casinoUser", JSON.stringify(user))
      router.push("/main")
      return true

    } catch (error) {
      console.error("Error al conectar con el backend:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('casinoUser')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
