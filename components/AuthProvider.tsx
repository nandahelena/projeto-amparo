"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAuthUser, getAuthToken, setAuthToken, clearAuth, User } from '@/lib/auth'

type AuthContextType = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Hydrate from localStorage on mount
    const u = getAuthUser()
    const t = getAuthToken()
    setUser(u)
    setToken(t)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    
    const onStorage = (e: StorageEvent) => {
      if (e.key === null) return
      if (e.key === 'projeto-amparo-last-activity' || e.key === 'projeto-amparo-user' || e.key === 'projeto-amparo-token') {
        setUser(getAuthUser())
        setToken(getAuthToken())
      }
    }
    
    const onFocus = () => {
      // Re-sync when tab comes back into focus
      setUser(getAuthUser())
      setToken(getAuthToken())
    }
    
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
    }
  }, [isHydrated])

  const login = (newToken: string, newUser: User) => {
    setAuthToken(newToken, newUser)
    setUser(newUser)
    setToken(newToken)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
