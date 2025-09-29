"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Phone, Clock, Navigation, Search, Shield } from "lucide-react"

interface Resource {
  id: string
  name: string
  type: "delegacia" | "defensoria" | "ong" | "hospital" | "abrigo" | "juridico"
  address: string
  phone: string
  hours: string
  services: string[]
  distance?: number
  lat?: number
  lng?: number
}

export default function RecursosProximosPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<string>("pending")

  const mockResources: Resource[] = [
    {
      id: "1",
      name: "Delegacia Especializada de Atendimento à Mulher - Centro",
      type: "delegacia",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 3333-1111",
      hours: "24 horas",
      services: ["Boletim de Ocorrência", "Medidas Protetivas", "Investigação"],
      lat: -23.5505,
      lng: -46.6333,
    },
    {
      id: "2",
      name: "Defensoria Pública - Núcleo da Mulher",
      type: "defensoria",
      address: "Av. Paulista, 456 - Bela Vista",
      phone: "(11) 3333-2222",
      hours: "Segunda a sexta, 8h às 17h",
      services: ["Assistência Jurídica Gratuita", "Divórcio", "Pensão Alimentícia"],
      lat: -23.5618,
      lng: -46.6565,
    },
    {
      id: "3",
      name: "Casa da Mulher Brasileira",
      type: "abrigo",
      address: "Rua Segura, 789 - Vila Esperança",
      phone: "(11) 3333-3333",
      hours: "24 horas",
      services: ["Abrigo Temporário", "Apoio Psicológico", "Assistência Social"],
      lat: -23.5489,
      lng: -46.6388,
    },
    {
      id: "4",
      name: "ONG Mulheres em Ação",
      type: "ong",
      address: "Rua da Solidariedade, 321 - Liberdade",
      phone: "(11) 3333-4444",
      hours: "Segunda a sexta, 9h às 18h",
      services: ["Orientação Jurídica", "Grupos de Apoio", "Capacitação Profissional"],
      lat: -23.5587,
      lng: -46.6347,
    },
    {
      id: "5",
      name: "Hospital Municipal - Atendimento à Mulher",
      type: "hospital",
      address: "Av. da Saúde, 654 - Saúde",
      phone: "(11) 3333-5555",
      hours: "24 horas",
      services: ["Atendimento Médico", "Exames Periciais", "Apoio Psicológico"],
      lat: -23.5729,
      lng: -46.6395,
    },
    {
      id: "6",
      name: "Núcleo Jurídico - Universidade",
      type: "juridico",
      address: "Rua Universitária, 987 - Vila Madalena",
      phone: "(11) 3333-6666",
      hours: "Segunda a quinta, 14h às 18h",
      services: ["Consultoria Jurídica Gratuita", "Orientação Legal", "Acompanhamento Processual"],
      lat: -23.5505,
      lng: -46.6914,
    },
  ]

  useEffect(() => {
    setResources(mockResources)
    setFilteredResources(mockResources)

    // Solicitar localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setLocationPermission("granted")

          // Calcular distâncias
          const resourcesWithDistance = mockResources
            .map((resource) => ({
              ...resource,
              distance:
                resource.lat && resource.lng
                  ? calculateDistance(userPos.lat, userPos.lng, resource.lat, resource.lng)
                  : undefined,
            }))
            .sort((a, b) => (a.distance || Number.POSITIVE_INFINITY) - (b.distance || Number.POSITIVE_INFINITY))

          setResources(resourcesWithDistance)
          setFilteredResources(resourcesWithDistance)
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
          setLocationPermission("denied")
        },
      )
    }
  }, [])

  useEffect(() => {
    const filtered = resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = selectedType === "all" || resource.type === selectedType

      return matchesSearch && matchesType
    })

    setFilteredResources(filtered)
  }, [searchTerm, selectedType, resources])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "delegacia":
        return <Shield className="w-5 h-5 text-blue-600" />
      case "defensoria":
        return <Shield className="w-5 h-5 text-green-600" />
      case "ong":
        return <Shield className="w-5 h-5 text-purple-600" />
      case "hospital":
        return <Shield className="w-5 h-5 text-red-600" />
      case "abrigo":
        return <Shield className="w-5 h-5 text-orange-600" />
      case "juridico":
        return <Shield className="w-5 h-5 text-indigo-600" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "delegacia":
        return "Delegacia"
      case "defensoria":
        return "Defensoria Pública"
      case "ong":
        return "ONG"
      case "hospital":
        return "Hospital"
      case "abrigo":
        return "Casa de Abrigo"
      case "juridico":
        return "Assistência Jurídica"
      default:
        return "Outro"
    }
  }

  const openMaps = (resource: Resource) => {
    const query = encodeURIComponent(resource.address)
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(mapsUrl, "_blank")
  }

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setLocationPermission("granted")

          // Recalcular distâncias
          const resourcesWithDistance = resources
            .map((resource) => ({
              ...resource,
              distance:
                resource.lat && resource.lng
                  ? calculateDistance(userPos.lat, userPos.lng, resource.lat, resource.lng)
                  : undefined,
            }))
            .sort((a, b) => (a.distance || Number.POSITIVE_INFINITY) - (b.distance || Number.POSITIVE_INFINITY))

          setResources(resourcesWithDistance)
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
          setLocationPermission("denied")
        },
      )
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
              <MapPin className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Recursos Próximos</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Localização */}
        {locationPermission === "pending" && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">Permitir localização para encontrar recursos próximos</span>
                </div>
                <Button onClick={requestLocation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Permitir Localização
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {locationPermission === "denied" && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-orange-800">Localização não disponível. Mostrando todos os recursos.</span>
                </div>
                <Button onClick={requestLocation} variant="outline" size="sm">
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Encontre Recursos de Apoio</CardTitle>
            <CardDescription>Localize serviços jurídicos, assistenciais e de proteção na sua região</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, endereço ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo de recurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="delegacia">Delegacias</SelectItem>
                  <SelectItem value="defensoria">Defensoria Pública</SelectItem>
                  <SelectItem value="ong">ONGs</SelectItem>
                  <SelectItem value="hospital">Hospitais</SelectItem>
                  <SelectItem value="abrigo">Casas de Abrigo</SelectItem>
                  <SelectItem value="juridico">Assistência Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Recursos */}
        <div className="space-y-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(resource.type)}
                      <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {getTypeLabel(resource.type)}
                      </span>
                      {resource.distance && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {resource.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{resource.address}</span>
                      </div>

                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{resource.phone}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{resource.hours}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Serviços oferecidos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.services.map((service, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 space-y-2">
                    <Button
                      onClick={() => (window.location.href = `tel:${resource.phone}`)}
                      className="bg-[#A459D1] hover:bg-purple-600"
                      size="sm"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Ligar
                    </Button>

                    <Button onClick={() => openMaps(resource)} variant="outline" size="sm" className="w-full">
                      <Navigation className="w-4 h-4 mr-1" />
                      Rotas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum recurso encontrado</h3>
              <p className="text-gray-500">
                Tente ajustar sua busca ou entre em contato conosco para mais informações sobre recursos na sua região.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Informações Importantes */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">📍 Dicas Importantes:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Ligue antes de se deslocar para confirmar horários e disponibilidade</li>
              <li>• Leve documentos pessoais e dos filhos (se houver)</li>
              <li>• Em emergência, ligue 190 (Polícia) ou 180 (Central da Mulher)</li>
              <li>• Alguns serviços podem exigir agendamento prévio</li>
              <li>• Mantenha sempre um plano de segurança pessoal</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
