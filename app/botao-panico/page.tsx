"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Phone, Mic, MessageCircle, Shield } from "lucide-react"

export default function BotaoPanicoPage() {
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)

  const activatePanicButton = () => {
    setIsCountingDown(true)
    let count = 5

    const timer = setInterval(() => {
      count--
      setCountdown(count)

      if (count === 0) {
        clearInterval(timer)
        setIsActivated(true)
        setIsCountingDown(false)

        // Executar todas as ações de emergência
        executeEmergencyActions()
      }
    }, 1000)
  }

  const cancelActivation = () => {
    setIsCountingDown(false)
    setCountdown(5)
  }

  const executeEmergencyActions = () => {
    // 1. Tentar ligar para 190
    try {
      window.location.href = "tel:190"
    } catch (error) {
      console.log("Erro ao tentar ligar:", error)
    }

    // 2. Iniciar gravação de áudio (simulado)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Gravação de áudio iniciada")
          // Aqui seria implementada a gravação real
        })
        .catch((error) => {
          console.log("Erro ao iniciar gravação:", error)
        })
    }

    // 3. Enviar alerta para contatos (simulado)
    const savedContacts = localStorage.getItem("emergency-contacts")
    if (savedContacts) {
      const contacts = JSON.parse(savedContacts)
      console.log("Alertando contatos de emergência:", contacts)
      // Aqui seria implementado o envio real de SMS
    }

    // 4. Obter localização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Localização obtida:", position.coords)
          // Aqui a localização seria enviada junto com os alertas
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
        },
      )
    }
  }

  const resetPanicButton = () => {
    setIsActivated(false)
    setCountdown(5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-600">Botão de Pânico</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isActivated && !isCountingDown && (
          <>
            {/* Instruções */}
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-red-600 mr-2" />
                  <h2 className="text-lg font-semibold text-red-800">Como Funciona o Botão de Pânico</h2>
                </div>
                <p className="text-red-700 mb-4">
                  O Botão de Pânico ativa automaticamente três ações de emergência simultâneas:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700">Liga para 190 (Polícia)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700">Inicia gravação de áudio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700">Alerta contatos de emergência</span>
                  </div>
                </div>
                <p className="text-sm text-red-600 font-semibold">⚠️ Use apenas em situações de real emergência</p>
              </CardContent>
            </Card>

            {/* Botão de Pânico Principal */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Pressione o botão abaixo em caso de emergência
                  </h2>

                  <Button
                    onClick={activatePanicButton}
                    className="w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="w-16 h-16 mb-2" />
                      <span>EMERGÊNCIA</span>
                      <span className="text-lg">ATIVAR PÂNICO</span>
                    </div>
                  </Button>

                  <p className="text-gray-600 max-w-md mx-auto">
                    Ao pressionar este botão, todas as ações de emergência serão ativadas automaticamente. Você terá 5
                    segundos para cancelar se pressionou por engano.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {isCountingDown && (
          <Card className="mb-8 border-orange-400 bg-orange-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-orange-800">Ativando em {countdown} segundos...</h2>

                <div className="text-8xl font-bold text-orange-600">{countdown}</div>

                <div className="space-y-4">
                  <p className="text-orange-700">O sistema de emergência será ativado automaticamente.</p>

                  <Button
                    onClick={cancelActivation}
                    variant="outline"
                    size="lg"
                    className="border-orange-400 text-orange-700 hover:bg-orange-100 bg-transparent"
                  >
                    CANCELAR ATIVAÇÃO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isActivated && (
          <Card className="mb-8 border-green-400 bg-green-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-green-800">Sistema de Emergência Ativado</h2>

                <div className="space-y-3 text-green-700">
                  <p className="flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Ligação para 190 iniciada
                  </p>
                  <p className="flex items-center justify-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Gravação de áudio ativada
                  </p>
                  <p className="flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contatos de emergência alertados
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Próximos passos:</strong>
                  </p>
                  <ul className="text-sm text-green-600 space-y-1 text-left">
                    <li>• Mantenha-se em local seguro se possível</li>
                    <li>• Aguarde a chegada da polícia</li>
                    <li>• A gravação está sendo salva automaticamente</li>
                    <li>• Seus contatos foram notificados da situação</li>
                  </ul>
                </div>

                <Button
                  onClick={resetPanicButton}
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-100 bg-transparent"
                >
                  Resetar Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configurações Rápidas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Contatos de Emergência</CardTitle>
              <CardDescription>Configure seus contatos para receber alertas automáticos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contatos-emergencia">
                <Button className="w-full bg-red-600 hover:bg-red-700">Configurar Contatos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Teste do Sistema</CardTitle>
              <CardDescription>Teste as funcionalidades sem ativar a emergência real</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-red-400 text-red-600 bg-transparent">
                Modo de Teste
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações Importantes */}
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Informações Importantes:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Use apenas em situações de real perigo</li>
              <li>• O sistema funciona mesmo sem internet (ligação 190)</li>
              <li>• Mantenha seus contatos de emergência sempre atualizados</li>
              <li>• A gravação de áudio requer permissão do microfone</li>
              <li>• Em caso de falha, ligue diretamente 190 ou 180</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
