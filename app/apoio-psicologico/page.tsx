"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Heart, MapPin, Phone, Globe, Clock, Search } from "lucide-react"

interface SupportService {
  id: string
  name: string
  type: "presencial" | "online" | "telefone"
  description: string
  contact: string
  hours: string
  location?: string
  distance?: number
  website?: string
  free: boolean
}

export default function ApoioPsicologicoPage() {
  const [services, setServices] = useState<SupportService[]>([])
  const [filteredServices, setFilteredServices] = useState<SupportService[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const supportServices: SupportService[] = [
    {
      id: "1",
      name: "Centro de Valorização da Vida (CVV)",
      type: "telefone",
      description: "Apoio emocional e prevenção do suicídio. Atendimento voluntário e gratuito.",
      contact: "188",
      hours: "24 horas",
      website: "https://www.cvv.org.br",
      free: true,
    },
    {
      id: "2",
      name: "CAPS - Centro de Atenção Psicossocial",
      type: "presencial",
      description: "Atendimento psicológico e psiquiátrico gratuito pelo SUS.",
      contact: "Varia por unidade",
      hours: "Segunda a sexta, 7h às 17h",
      location: "Diversas unidades na cidade",
      free: true,
    },
    {
      id: "3",
      name: "Mapa da Saúde Mental",
      type: "online",
      description: "Plataforma online com profissionais de saúde mental com preços acessíveis.",
      contact: "www.mapadasaudemental.com.br",
      hours: "Conforme disponibilidade do profissional",
      website: "https://mapadasaudemental.com.br",
      free: false,
    },
    {
      id: "4",
      name: "Núcleo de Psicologia - Universidades",
      type: "presencial",
      description: "Atendimento psicológico gratuito realizado por estudantes supervisionados.",
      contact: "Varia por universidade",
      hours: "Conforme cronograma acadêmico",
      location: "Universidades locais",
      free: true,
    },
    {
      id: "5",
      name: "Terapia Online - Zenklub",
      type: "online",
      description: "Plataforma de terapia online com psicólogos certificados.",
      contact: "App Zenklub",
      hours: "Conforme agendamento",
      website: "https://zenklub.com.br",
      free: false,
    },
    {
      id: "6",
      name: "Casa da Mulher Brasileira",
      type: "presencial",
      description: "Atendimento psicológico especializado para mulheres em situação de violência.",
      contact: "180",
      hours: "24 horas",
      location: "Capitais e grandes cidades",
      free: true,
    },
    {
      id: "7",
      name: "Projeto Acolher - ONG",
      type: "presencial",
      description: "Atendimento psicológico gratuito para mulheres vítimas de violência.",
      contact: "(11) 3333-4444",
      hours: "Segunda a sexta, 9h às 18h",
      location: "São Paulo - SP",
      free: true,
    },
    {
      id: "8",
      name: "Psicólogos Sem Fronteiras",
      type: "online",
      description: "Atendimento psicológico online gratuito em situações de crise.",
      contact: "psicologossemfronteiras.org",
      hours: "Conforme disponibilidade",
      website: "https://psicologossemfronteiras.org",
      free: true,
    },
  ]

  useEffect(() => {
    setServices(supportServices)
    setFilteredServices(supportServices)

    // Solicitar localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
        },
      )
    }
  }, [])

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredServices(filtered)
  }, [searchTerm, services])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "telefone":
        return <Phone className="w-5 h-5" />
      case "online":
        return <Globe className="w-5 h-5" />
      case "presencial":
        return <MapPin className="w-5 h-5" />
      default:
        return <Heart className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "telefone":
        return "Telefone"
      case "online":
        return "Online"
      case "presencial":
        return "Presencial"
      default:
        return "Outro"
    }
  }

  const handleContact = (service: SupportService) => {
    if (service.type === "telefone") {
      window.location.href = `tel:${service.contact}`
    } else if (service.website) {
      window.open(service.website, "_blank")
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
              <Heart className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Apoio Psicológico</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Encontre Apoio Psicológico</CardTitle>
            <CardDescription>
              Busque por serviços de apoio psicológico gratuitos e acessíveis na sua região
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por tipo de atendimento, localização ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergência Psicológica */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-red-800">Emergência Psicológica</h2>
            </div>
            <p className="text-red-700 mb-4">Se você está pensando em se machucar ou está em crise emocional grave:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => (window.location.href = "tel:188")} className="bg-red-600 hover:bg-red-700">
                <Phone className="w-4 h-4 mr-2" />
                CVV - 188 (24h)
              </Button>
              <Button
                onClick={() => (window.location.href = "tel:192")}
                variant="outline"
                className="border-red-400 text-red-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                SAMU - 192
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Serviços */}
        <div className="space-y-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(service.type)}
                      <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                      {service.free && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Gratuito</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{service.description}</p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{service.hours}</span>
                      </div>

                      {service.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{service.location}</span>
                        </div>
                      )}

                      <div className="flex items-center">
                        {getTypeIcon(service.type)}
                        <span className="ml-2">
                          {getTypeLabel(service.type)}: {service.contact}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 space-y-2">
                    <Button
                      onClick={() => handleContact(service)}
                      className="bg-[#A459D1] hover:bg-purple-600"
                      size="sm"
                    >
                      {service.type === "telefone" ? "Ligar" : "Acessar"}
                    </Button>

                    {service.website && service.type !== "telefone" && (
                      <Button
                        onClick={() => window.open(service.website, "_blank")}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Site
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum serviço encontrado</h3>
              <p className="text-gray-500">
                Tente ajustar sua busca ou entre em contato conosco para mais informações.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dicas de Bem-estar */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💙 Dicas de Autocuidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Cuidados Imediatos:</h4>
                <ul className="space-y-1">
                  <li>• Respire profundamente por alguns minutos</li>
                  <li>• Beba água e mantenha-se hidratada</li>
                  <li>• Procure um ambiente seguro e calmo</li>
                  <li>• Entre em contato com alguém de confiança</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cuidados Contínuos:</h4>
                <ul className="space-y-1">
                  <li>• Mantenha uma rotina de sono regular</li>
                  <li>• Pratique atividades que lhe dão prazer</li>
                  <li>• Evite isolamento social</li>
                  <li>• Considere terapia como investimento em si</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
