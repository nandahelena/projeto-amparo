"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mic, AlertTriangle, Heart, MapPin, MessageCircle, FileText, Shield, Lock, Clock } from "lucide-react"

export default function HomePage() {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("projeto-amparo-token")
    if (token) {
      router.push("/dashboard")
      return
    }
    setIsChecking(false)
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#A459D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-50">
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
              <h1 className="text-2xl font-bold text-[#A459D1]">Projeto Amparo</h1>
            </div>
            <Link href="/auth/login">
              <Button className="bg-[#A459D1] hover:bg-purple-600 text-white">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-[#A459D1] mb-4">Apoio Integral para Mulheres</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            O Projeto Amparo oferece suporte jurídico, psicossocial e ferramentas de proteção para mulheres vítimas de violência sexual.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/register">
              <Button className="bg-[#A459D1] hover:bg-purple-600 text-white px-8 py-6 text-lg">
                Criar Conta Agora
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Citação */}
        <div className="text-center mb-16 py-8 bg-white rounded-lg shadow-md border-l-4 border-[#A459D1]">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic">
            "Romper o silêncio é o primeiro passo para a liberdade."
          </blockquote>
        </div>

        {/* Recursos Principais */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Mic className="w-8 h-8 text-[#A459D1]" />
                <CardTitle>Gravar Áudio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Grave evidências seguras com data, hora e localização automáticas. Seus arquivos são salvos localmente no seu dispositivo.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-[#A459D1]" />
                <CardTitle>Dados Seguros</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Todos os seus dados são salvos localmente. Você tem controle total sobre quando e com quem compartilhar informações.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-[#A459D1]" />
                <CardTitle>Apoio Jurídico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse orientações sobre seus direitos, medidas protetivas e recursos legais disponíveis para você.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Emergência - Destaque */}
        <div className="mb-12">
          <Card className="border-red-200 shadow-lg">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="flex items-center text-2xl">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Em Caso de Emergência
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-12 h-12 text-red-600" />
                  <div>
                    <h3 className="font-bold text-lg">Ligar 190</h3>
                    <p className="text-gray-600">Polícia Militar - Disponível 24 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Heart className="w-12 h-12 text-red-600" />
                  <div>
                    <h3 className="font-bold text-lg">Ligar 180</h3>
                    <p className="text-gray-600">Central de Atendimento à Mulher</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-[#A459D1] mb-8 text-center">O que oferecemos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-[#A459D1] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Manual de Fuga</h4>
                <p className="text-sm text-gray-600">Planeje sua saída com segurança</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-[#A459D1] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Recursos Próximos</h4>
                <p className="text-sm text-gray-600">Encontre serviços na sua região</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-[#A459D1] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Apoio Psicológico</h4>
                <p className="text-sm text-gray-600">Redes de apoio especializadas</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-[#A459D1] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Disponível 24/7</h4>
                <p className="text-sm text-gray-600">Sempre ao seu lado</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white rounded-lg p-12 text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Você não está sozinha</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Milhares de mulheres já estão usando o Projeto Amparo para se proteger e acessar recursos de apoio. Crie sua conta agora e comece sua jornada.
          </p>
          <Link href="/auth/register">
            <Button className="bg-white text-[#A459D1] hover:bg-gray-100 px-8 py-6 text-lg font-bold">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>

        {/* Segurança */}
        <Card className="border-green-200 bg-green-50 mb-12">
          <CardContent className="p-8">
            <h3 className="font-bold text-green-800 mb-4 text-lg">🔒 Seu Segurança é Nossa Prioridade</h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center"><Shield className="w-4 h-4 mr-2" />Criptografia de dados</li>
              <li className="flex items-center"><Lock className="w-4 h-4 mr-2" />Sem compartilhamento com terceiros</li>
              <li className="flex items-center"><Shield className="w-4 h-4 mr-2" />Controle total sobre suas informações</li>
              <li className="flex items-center"><Lock className="w-4 h-4 mr-2" />Dados salvos apenas localmente</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-[#A459D1] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-purple-200 mb-2">© 2024 Projeto Amparo. Todos os direitos reservados.</p>
          <p className="text-xs text-purple-300">
            Em caso de emergência, ligue 190 (Polícia) ou 180 (Central de Atendimento à Mulher)
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://instagram.com/amparoofc" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
              Instagram @amparoofc
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
