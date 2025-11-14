"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { setAuthToken, getBackendUrl } from '@/lib/auth'
import { useAuthContext } from '@/components/AuthProvider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Calendar, MapPin, AlertTriangle } from "lucide-react"
import { BackButton } from "@/components/BackButton"

export const dynamic = "force-dynamic"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    city: "",
    state: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return false
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return false
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError("Você deve aceitar os termos de uso e política de privacidade.")
      return false
    }

    // Validação da data de nascimento (se preenchida)
    if (formData.dateOfBirth) {
      const dobString = formData.dateOfBirth
      // formato esperado YYYY-MM-DD
      const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(dobString)
      const dob = new Date(dobString)
      const now = new Date()
      const year = dob.getUTCFullYear()
      const currentYear = now.getUTCFullYear()

      if (!isoMatch || Number.isNaN(dob.getTime())) {
        setError('Data de nascimento inválida.')
        return false
      }
      if (year < 1900 || year > currentYear) {
        setError(`Insira um ano válido entre 1900 e ${currentYear}.`)
        return false
      }
      if (dob > now) {
        setError('A data de nascimento não pode ser no futuro.')
        return false
      }
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Enviar para o backend
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
      }

      const res = await fetch(getBackendUrl('/api/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const resJson = await res.json()
      if (!res.ok) {
        setError(resJson.error || 'Erro ao criar conta')
        setIsLoading(false)
        return
      }

      // Autenticar automaticamente
      const loginResp = await fetch(getBackendUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const loginJson = await loginResp.json()
      if (!loginResp.ok) {
        setError(loginJson.error || 'Conta criada, mas não foi possível autenticar.')
        setIsLoading(false)
        return
      }

      // Salvar token + user
      try {
        setAuthToken(loginJson.token, loginJson.user)
        // also notify other tabs
        localStorage.setItem('projeto-amparo-last-activity', Date.now().toString())
      } catch (e) {
        // ignore
      }

      router.push('/dashboard')
    } catch (error) {
      console.error("Erro no cadastro:", error)
      setError("Erro interno. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const brazilianStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <p className="text-gray-600">Crie sua conta para salvar seus dados com segurança</p>
        </div>

        {/* Aviso sobre modo offline */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">Modo Offline Ativo</span>
            </div>
            <p className="text-sm text-orange-700">
              Seus dados serão salvos localmente no dispositivo. Todos os recursos funcionam normalmente.
            </p>
          </CardContent>
        </Card>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#A459D1]">Criar Conta</CardTitle>
            <CardDescription className="text-center">Seus dados serão protegidos e salvos localmente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              {/* Dados de Acesso */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Dados de Acesso</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repita sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Dados Pessoais (Opcionais)</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="city"
                        type="text"
                        placeholder="Sua cidade"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contato de Emergência */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Contato de Emergência (Opcional)</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Nome do Contato</Label>
                    <Input
                      id="emergencyContact"
                      type="text"
                      placeholder="Nome de pessoa de confiança"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefone do Contato</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Aceito os{" "}
                    <Link href="/terms" className="text-[#A459D1] hover:text-purple-600">
                      Termos de Uso
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    Aceito a{" "}
                    <Link href="/privacy" className="text-[#A459D1] hover:text-purple-600">
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#A459D1] hover:bg-purple-600" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-[#A459D1] hover:text-purple-600 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🛡️ Proteção dos seus dados:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Todos os dados são salvos localmente no seu dispositivo</li>
              <li>• Você pode alterar ou excluir suas informações a qualquer momento</li>
              <li>• Nunca compartilhamos dados com terceiros</li>
              <li>• Funciona mesmo sem conexão com internet</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
