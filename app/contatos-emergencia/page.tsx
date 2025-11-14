"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, MessageCircle, Phone, AlertTriangle, Edit } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: number
}

export default function ContatosEmergenciaPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState<string | null>(null)
  const [emergencyMessage, setEmergencyMessage] = useState(
    "EMERGÊNCIA - Esta é uma mensagem automática do Projeto Amparo. Preciso de ajuda urgente. Por favor, entre em contato comigo ou ligue para a polícia (190).",
  )

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  })

  useEffect(() => {
    // Carregar contatos salvos
    const savedContacts = localStorage.getItem("emergency-contacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }

    // Carregar mensagem personalizada
    const savedMessage = localStorage.getItem("emergency-message")
    if (savedMessage) {
      setEmergencyMessage(savedMessage)
    }
  }, [])

  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    setContacts(updatedContacts)
    localStorage.setItem("emergency-contacts", JSON.stringify(updatedContacts))
  }

  const addContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship,
        priority: contacts.length + 1,
      }

      const updatedContacts = [...contacts, contact]
      saveContacts(updatedContacts)

      setNewContact({ name: "", phone: "", relationship: "" })
      setIsAddingContact(false)
    }
  }

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id)
    saveContacts(updatedContacts)
  }

  const updateContact = (id: string, updatedData: Partial<EmergencyContact>) => {
    const updatedContacts = contacts.map((contact) => (contact.id === id ? { ...contact, ...updatedData } : contact))
    saveContacts(updatedContacts)
    setEditingContact(null)
  }

  const sendEmergencyAlert = async () => {
    if (contacts.length === 0) {
      alert("Nenhum contato de emergência cadastrado!")
      return
    }

    // Simular envio de SMS (em produção, seria integrado com API de SMS)
    const confirmSend = confirm(
      `Enviar alerta de emergência para ${contacts.length} contato(s)?\n\nMensagem: "${emergencyMessage}"`,
    )

    if (confirmSend) {
      try {
        // Aqui seria implementada a integração real com serviço de SMS
        console.log("Enviando alertas para:", contacts)
        console.log("Mensagem:", emergencyMessage)

        // Simular sucesso
        alert("Alertas de emergência enviados com sucesso!")

        // Registrar o envio
        const alertLog = {
          timestamp: new Date().toISOString(),
          contacts: contacts.length,
          message: emergencyMessage,
        }

        const logs = JSON.parse(localStorage.getItem("alert-logs") || "[]")
        logs.push(alertLog)
        localStorage.setItem("alert-logs", JSON.stringify(logs))
      } catch (error) {
        console.error("Erro ao enviar alertas:", error)
        alert("Erro ao enviar alertas. Tente novamente ou ligue diretamente para seus contatos.")
      }
    }
  }

  const saveEmergencyMessage = () => {
    localStorage.setItem("emergency-message", emergencyMessage)
    alert("Mensagem de emergência salva!")
  }

  const callContact = (phone: string) => {
    window.location.href = `tel:${phone}`
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
              <MessageCircle className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Contatos de Emergência</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Botão de Alerta Rápido */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-red-800">Alerta de Emergência</h2>
                  <p className="text-red-700 text-sm">Envie SMS automático para todos os seus contatos cadastrados</p>
                </div>
              </div>
              <Button
                onClick={sendEmergencyAlert}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={contacts.length === 0}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                ALERTAR AGORA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contatos */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[#A459D1]">Seus Contatos de Emergência</CardTitle>
                <CardDescription>
                  Cadastre pessoas de confiança que serão alertadas em situações de emergência
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddingContact(true)} className="bg-[#A459D1] hover:bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum contato cadastrado</h3>
                <p className="text-gray-500 mb-4">
                  Adicione contatos de confiança para receber alertas automáticos em emergências
                </p>
                <Button onClick={() => setIsAddingContact(true)} className="bg-[#A459D1] hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Contato
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 bg-white">
                    {editingContact === contact.id ? (
                      <div className="space-y-3">
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                          placeholder="Nome"
                        />
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                          placeholder="Telefone"
                        />
                        <Input
                          value={contact.relationship}
                          onChange={(e) => updateContact(contact.id, { relationship: e.target.value })}
                          placeholder="Relacionamento"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => setEditingContact(null)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContact(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          <p className="text-sm text-gray-500">{contact.relationship}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => callContact(contact.phone)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContact(contact.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeContact(contact.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário para Adicionar Contato */}
        {isAddingContact && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-[#A459D1]">Adicionar Novo Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Maria Silva"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone (com DDD)</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relacionamento</Label>
                  <Select
                    value={newContact.relationship}
                    onValueChange={(value) => setNewContact((prev) => ({ ...prev, relationship: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o relacionamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="irma">Irmã</SelectItem>
                      <SelectItem value="irmao">Irmão</SelectItem>
                      <SelectItem value="amiga">Amiga</SelectItem>
                      <SelectItem value="amigo">Amigo</SelectItem>
                      <SelectItem value="prima">Prima</SelectItem>
                      <SelectItem value="primo">Primo</SelectItem>
                      <SelectItem value="tia">Tia</SelectItem>
                      <SelectItem value="tio">Tio</SelectItem>
                      <SelectItem value="vizinha">Vizinha</SelectItem>
                      <SelectItem value="vizinho">Vizinho</SelectItem>
                      <SelectItem value="colega">Colega</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={addContact} className="bg-[#A459D1] hover:bg-purple-600">
                    Adicionar Contato
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingContact(false)
                      setNewContact({ name: "", phone: "", relationship: "" })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensagem de Emergência */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Mensagem de Emergência</CardTitle>
            <CardDescription>
              Personalize a mensagem que será enviada para seus contatos em caso de emergência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                placeholder="Digite sua mensagem de emergência..."
                rows={4}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Caracteres: {emergencyMessage.length}/160 (recomendado para SMS)
                </p>
                <Button onClick={saveEmergencyMessage} variant="outline">
                  Salvar Mensagem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">🔒 Informações de Segurança:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Cadastre apenas pessoas de extrema confiança</li>
              <li>• Mantenha os contatos sempre atualizados</li>
              <li>• Teste o sistema periodicamente</li>
              <li>• A mensagem será enviada automaticamente em emergências</li>
              <li>• Em caso de falha, ligue diretamente para os contatos</li>
              <li>• Nunca compartilhe seus contatos de emergência com o agressor</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  )
}
