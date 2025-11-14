"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, AlertTriangle } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DiscagemDiretaPage() {
  const handleEmergencyCall = () => {
    // Tenta fazer a ligação direta
    if (typeof window !== "undefined") {
      window.location.href = "tel:190"
    }
  }

  const handleWomenHelpline = () => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:180"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Phone className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Discagem Direta</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerta de Emergência */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-red-800">Situação de Emergência</h2>
            </div>
            <p className="text-red-700 mb-4">
              Se você está em perigo imediato, use os botões abaixo para ligar diretamente para os serviços de
              emergência.
            </p>
            <p className="text-sm text-red-600">Certifique-se de estar em local seguro antes de fazer a ligação.</p>
          </CardContent>
        </Card>

        {/* Botões de Emergência */}
        <div className="space-y-6">
          {/* Polícia Militar - 190 */}
          <Card>
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="text-center text-2xl">Polícia Militar</CardTitle>
              <CardDescription className="text-red-100 text-center">
                Para situações de emergência e crimes em andamento
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={handleEmergencyCall}
                className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold"
              >
                <Phone className="w-8 h-8 mr-3" />
                LIGAR 190
              </Button>
              <p className="text-center text-sm text-gray-600 mt-3">
                Toque no botão acima para ligar diretamente para a Polícia Militar
              </p>
            </CardContent>
          </Card>

          {/* Central de Atendimento à Mulher - 180 */}
          <Card>
            <CardHeader className="bg-[#A459D1] text-white">
              <CardTitle className="text-center text-2xl">Central de Atendimento à Mulher</CardTitle>
              <CardDescription className="text-purple-100 text-center">
                Orientação e denúncia de violência contra a mulher
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={handleWomenHelpline}
                className="w-full h-20 bg-[#A459D1] hover:bg-purple-600 text-white text-2xl font-bold"
              >
                <Phone className="w-8 h-8 mr-3" />
                LIGAR 180
              </Button>
              <p className="text-center text-sm text-gray-600 mt-3">
                Atendimento 24h, gratuito e sigiloso para orientação sobre violência
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Outros Contatos Importantes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Outros Contatos Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">SAMU - Emergências Médicas</h3>
                  <p className="text-sm text-gray-600">Atendimento médico de urgência</p>
                </div>
                <Button onClick={() => (window.location.href = "tel:192")} variant="outline" size="sm">
                  192
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Bombeiros</h3>
                  <p className="text-sm text-gray-600">Emergências e resgates</p>
                </div>
                <Button onClick={() => (window.location.href = "tel:193")} variant="outline" size="sm">
                  193
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Disque Direitos Humanos</h3>
                  <p className="text-sm text-gray-600">Denúncias de violações de direitos</p>
                </div>
                <Button onClick={() => (window.location.href = "tel:100")} variant="outline" size="sm">
                  100
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções de Segurança */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">💡 Dicas de Segurança:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Mantenha-se em local seguro durante a ligação</li>
              <li>• Tenha informações básicas prontas: endereço, situação</li>
              <li>• Se não puder falar, deixe a ligação aberta</li>
              <li>• Siga as orientações do atendente</li>
              <li>• Mantenha o telefone carregado sempre que possível</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  )
}
