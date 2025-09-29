"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageCircle, Send, Scale } from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatJuridicoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou a assistente jurídica do Projeto Amparo. Posso ajudar você com informações sobre seus direitos legais, medidas protetivas, boletins de ocorrência e questões relacionadas à violência contra a mulher. Como posso ajudar você hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const legalResponses: { [key: string]: string } = {
    "medida protetiva":
      "As medidas protetivas são determinações judiciais que visam proteger a mulher em situação de violência. Podem incluir: afastamento do agressor do lar, proibição de aproximação, suspensão de visitas aos filhos, entre outras. Para solicitar, procure uma Delegacia da Mulher, Ministério Público ou Defensoria Pública.",
    "boletim de ocorrencia":
      "O Boletim de Ocorrência (BO) é fundamental para registrar a violência sofrida. Pode ser feito em qualquer delegacia, preferencialmente na Delegacia da Mulher. Leve documentos, evidências (fotos, mensagens) e, se possível, testemunhas. O BO é gratuito e pode ser feito online em alguns estados.",
    feminicidio:
      "Feminicídio é o crime de homicídio praticado contra a mulher por razões da condição de sexo feminino. É crime hediondo com pena de 12 a 30 anos de prisão. Sinais de risco incluem ameaças de morte, violência física crescente, perseguição e controle excessivo.",
    "lei maria da penha":
      "A Lei Maria da Penha (Lei 11.340/2006) protege mulheres contra violência doméstica e familiar. Prevê medidas protetivas, atendimento especializado e punição mais rigorosa para agressores. Garante direito a casa-abrigo, atendimento médico e psicológico.",
    "direitos da mulher":
      "Seus direitos incluem: vida sem violência, integridade física e psicológica, liberdade, dignidade, atendimento especializado, medidas protetivas, sigilo sobre sua condição, atendimento humanizado pela polícia e Judiciário.",
    "delegacia da mulher":
      "As Delegacias Especializadas de Atendimento à Mulher (DEAMs) são especializadas em crimes contra mulheres. Oferecem atendimento humanizado, registram ocorrências e investigam crimes. Funcionam 24h em muitas cidades ou têm plantões especiais.",
    "defensoria publica":
      "A Defensoria Pública oferece assistência jurídica gratuita para mulheres em situação de vulnerabilidade. Pode ajudar com medidas protetivas, divórcio, pensão alimentícia, guarda dos filhos. O atendimento é gratuito para quem não pode pagar advogado.",
    "violencia domestica":
      "Violência doméstica inclui: física, psicológica, sexual, patrimonial e moral. Pode ser praticada por parceiro, ex-parceiro, familiares. É crime e você tem direito à proteção. Procure ajuda: Ligue 180, procure delegacia ou órgãos de proteção.",
  }

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(legalResponses)) {
      if (message.includes(key)) {
        return response
      }
    }

    // Respostas para palavras-chave específicas
    if (message.includes("ajuda") || message.includes("socorro")) {
      return "Se você está em perigo imediato, ligue 190 (Polícia) ou 180 (Central da Mulher). Para orientação jurídica, posso ajudar com informações sobre medidas protetivas, boletim de ocorrência, seus direitos legais. O que você gostaria de saber?"
    }

    if (message.includes("advogado") || message.includes("advogada")) {
      return "Se você não tem condições de contratar um advogado, procure a Defensoria Pública da sua região. Eles oferecem assistência jurídica gratuita. Também existem ONGs e núcleos de prática jurídica em universidades que podem ajudar."
    }

    if (message.includes("denuncia") || message.includes("denunciar")) {
      return "Você pode denunciar violência através do: Ligue 180 (Central da Mulher), Disque 100 (Direitos Humanos), presencialmente em delegacias, online através dos portais dos órgãos de segurança. A denúncia pode ser anônima."
    }

    // Resposta padrão
    return "Entendo sua preocupação. Posso ajudar com informações sobre: medidas protetivas, boletim de ocorrência, Lei Maria da Penha, feminicídio, direitos da mulher, delegacias especializadas e defensoria pública. Sobre qual tema você gostaria de saber mais?"
  }

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simular resposta da IA
    setTimeout(() => {
      const response = getResponse(inputText)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
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
              <Scale className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Chat Jurídico</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Assistente Jurídica - Projeto Amparo
            </CardTitle>
            <CardDescription className="text-purple-100">
              Tire suas dúvidas sobre direitos legais, medidas protetivas e procedimentos jurídicos
            </CardDescription>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser ? "bg-[#A459D1] text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? "text-purple-200" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre direitos legais..."
                className="flex-1"
              />
              <Button onClick={sendMessage} className="bg-[#A459D1] hover:bg-purple-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Temas Sugeridos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Temas que posso ajudar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Medidas Protetivas",
                "Boletim de Ocorrência",
                "Lei Maria da Penha",
                "Feminicídio",
                "Direitos da Mulher",
                "Delegacia da Mulher",
                "Defensoria Pública",
                "Violência Doméstica",
              ].map((tema) => (
                <Button
                  key={tema}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(`Me fale sobre ${tema.toLowerCase()}`)}
                  className="justify-start"
                >
                  {tema}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aviso Legal */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">⚖️ Aviso Legal:</h3>
            <p className="text-sm text-orange-700">
              As informações fornecidas têm caráter orientativo e não substituem a consulta com um advogado. Para casos
              específicos, procure sempre orientação jurídica profissional através da Defensoria Pública ou advogado
              especializado em direitos da mulher.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
