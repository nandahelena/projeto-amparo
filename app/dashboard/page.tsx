"use client"

import { useEffect, useState } from "react"
import { useAuthContext } from '@/components/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Settings,
  LogOut,
  Shield,
  Mic,
  MessageCircle,
  Phone,
  AlertTriangle,
  Heart,
  MapPin,
  FileText,
  Clock,
} from "lucide-react"

export const dynamic = "force-dynamic"

interface UserProfile {
  id: string
  fullName: string
  email: string
  city?: string
  state?: string
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [hasChecked, setHasChecked] = useState(false)

  const router = useRouter()
  const { logout } = (() => {
    try {
      return useAuthContext()
    } catch (e) {
      return { logout: () => {} }
    }
  })()

  useEffect(() => {
    if (hasChecked) return // Only run once
    
    const token = localStorage.getItem('projeto-amparo-token')
    const userStr = localStorage.getItem('projeto-amparo-user')
    
    if (!token || !userStr) {
      router.push('/auth/login')
      setHasChecked(true)
      return
    }

    try {
      const parsedUser = JSON.parse(userStr)
      setUser(parsedUser)

      // load profile & activities from localStorage
      const profileData = localStorage.getItem('projeto-amparo-profile')
      if (profileData) {
        try {
          setProfile(JSON.parse(profileData))
        } catch {
          // ignore
        }
      }

      const activities = JSON.parse(localStorage.getItem('projeto-amparo-activities') || '[]')
      if (activities.length === 0) {
        const defaultActivities = [
          { id: 1, type: 'account', description: 'Conta criada com sucesso', timestamp: new Date().toISOString() },
        ]
        localStorage.setItem('projeto-amparo-activities', JSON.stringify(defaultActivities))
        setRecentActivity(defaultActivities)
      } else {
        setRecentActivity(activities.slice(-5))
      }

      setIsLoading(false)
    } catch {
      router.push('/auth/login')
    }
    
    setHasChecked(true)
  }, [hasChecked, router])

  const handleLogout = async () => {
    try {
      // Limpar sessão via contexto
      try {
        // use logout from context if available
        // @ts-ignore
        if (typeof logout === 'function') logout()
      } catch (e) {
        localStorage.removeItem('projeto-amparo-user')
      }
      router.push('/')
    } catch (error) {
      console.error("Erro no logout:", error)
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#A459D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-4 h-4 text-purple-600" />
      case "contact":
        return <MessageCircle className="w-4 h-4 text-green-600" />
      case "plan":
        return <FileText className="w-4 h-4 text-blue-600" />
      case "account":
        return <User className="w-4 h-4 text-purple-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora há pouco"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} atrás`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/LOGO-AMPARO.png.png"
                alt="Projeto Amparo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#A459D1]">Projeto Amparo</h1>
                <p className="text-sm text-gray-600">Bem-vinda, {user?.fullName || user?.name || "Usuária"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Botão de Pânico - Destaque */}
        <div className="mb-8">
          <Link href="/botao-panico">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-bold shadow-lg">
              <AlertTriangle className="w-8 h-8 mr-3" />
              BOTÃO DE PÂNICO - EMERGÊNCIA
            </Button>
          </Link>
        </div>

        {/* Resumo da Conta */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#A459D1]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Perfil Completo</h3>
                  <p className="text-sm text-gray-600">
                    {profile?.city && profile?.state
                      ? `${profile.city}, ${profile.state}`
                      : "Localização não informada"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dados Seguros</h3>
                  <p className="text-sm text-gray-600">Salvos localmente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Membro desde</h3>
                  <p className="text-sm text-gray-600">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("pt-BR") : "Hoje"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recursos Principais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Seus Recursos</CardTitle>
            <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/gravar-audio">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Mic className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">Gravar Áudio</h3>
                    <p className="text-sm text-gray-600">Evidências seguras</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/contatos-emergencia">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">Contatos</h3>
                    <p className="text-sm text-gray-600">Alertas automáticos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/manual-fuga">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">Manual de Fuga</h3>
                    <p className="text-sm text-gray-600">Planejamento seguro</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/chat-juridico">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">Chat Jurídico</h3>
                    <p className="text-sm text-gray-600">Orientação legal</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#A459D1]">Atividade Recente</CardTitle>
              <CardDescription>Suas últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#A459D1]">Acesso Rápido</CardTitle>
              <CardDescription>Recursos de emergência sempre disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/discagem-direta">
                  <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar 190 - Emergência
                  </Button>
                </Link>

                <Link href="/apoio-psicologico">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Apoio Psicológico
                  </Button>
                </Link>

                <Link href="/recursos-proximos">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Recursos Próximos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
