"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { setAuthToken, getBackendUrl } from '@/lib/auth'
import { useAuthContext } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { BackButton } from "@/components/BackButton"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const { login } = (() => {
    try {
      return useAuthContext()
    } catch (e) {
      return { login: (t: string, u: any) => {} }
    }
  })()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular login por enquanto (sem Supabase)
    try {
      // Validação básica
      if (!email || !password) {
        setError("Por favor, preencha todos os campos.")
        return
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.")
        return
      }

      // Call backend login
      const response = await fetch(getBackendUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Email ou senha incorretos.')
        setIsLoading(false)
        return
      }

      // Save token and user via lib + context
      try {
        setAuthToken(data.token, data.user)
        try {
          login && login(data.token, data.user)
        } catch (e) {
          // ignore context errors
        }
      } catch (e) {
        // ignore
      }

      // Pequeno delay para garantir que localStorage foi atualizado
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error) {
      console.error("Erro no login:", error)
      setError("Erro interno. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <BackButton />
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Image
              src="/LOGO-AMPARO.png.png"
              alt="Projeto Amparo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-[#A459D1]">Projeto Amparo</h1>
          </div>
          <p className="text-gray-600">Entre na sua conta para acessar seus dados salvos</p>
        </div>

        {/* Aviso sobre modo offline */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">Modo Offline Ativo</span>
            </div>
            <p className="text-sm text-orange-700">
              Seus dados serão salvos localmente no dispositivo. Use qualquer email válido para continuar.
            </p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#A459D1]">Entrar</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta para sincronizar seus dados de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#A459D1] hover:bg-purple-600" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/auth/register" className="text-[#A459D1] hover:text-purple-600 font-medium">
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-2">🔒 Sua segurança é nossa prioridade:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Seus dados são salvos localmente no seu dispositivo</li>
              <li>• Nunca compartilhamos suas informações</li>
              <li>• Você pode limpar os dados a qualquer momento</li>
              <li>• Funciona mesmo sem conexão com internet</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
