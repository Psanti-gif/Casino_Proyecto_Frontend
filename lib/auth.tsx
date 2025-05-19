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
    // Check if user is already logged in
    const storedUser = localStorage.getItem('casinoUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
    
    // Redirect to login if not authenticated and not already on login page
    if (!storedUser && pathname !== '/login' && !loading) {
      router.push('/login')
    }
  }, [pathname, router, loading])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      
      // Mock user database
      const users = [
        { id: '1', username: 'admin', password: 'admin123', role: 'Admin', name: 'Administrador' },
        { id: '2', username: 'support', password: 'support123', role: 'Support', name: 'Soporte Técnico' },
        { id: '3', username: 'operator', password: 'operator123', role: 'Operator', name: 'Operador' },
      ]
      
      // Find user with matching credentials
      const foundUser = users.find(u => u.username === username && u.password === password)
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        const user = userWithoutPassword as User
        setUser(user)
        localStorage.setItem('casinoUser', JSON.stringify(user))
        router.push('/main')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
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