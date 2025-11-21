"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, MessageCircle, Phone, AlertTriangle, Edit, MessageSquare } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { getAuthUser } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { getPublicBackendUrl } from "@/lib/client-env"
import { useRef } from "react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: number
  isPrimary?: boolean
}

export default function ContatosEmergenciaPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState<string | null>(null)
  const [isSendingAlert, setIsSendingAlert] = useState(false)
  const [emergencyMessage, setEmergencyMessage] = useState(
    "EMERGÊNCIA - Esta é uma mensagem automática do Projeto Amparo. Preciso de ajuda urgente. Por favor, entre em contato comigo ou ligue para a polícia (190).",
  )

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  })

  useEffect(() => {
    // Carregar contato de emergência principal do user (settings)
    const user = getAuthUser()
    let allContacts: EmergencyContact[] = []

    // Se houver contato de emergência principal registrado em settings
    if (user?.emergencyContact && user?.emergencyPhone) {
      allContacts.push({
        id: "primary",
        name: user.emergencyContact,
        phone: user.emergencyPhone,
        relationship: "Contato de Emergência Principal",
        priority: 1,
        isPrimary: true,
      })
    }

    // Carregar contatos adicionais salvos em localStorage
    const savedAdditionalContacts = localStorage.getItem("emergency-contacts-additional")
    if (savedAdditionalContacts) {
      const additionalContacts = JSON.parse(savedAdditionalContacts)
      allContacts = [...allContacts, ...additionalContacts]
    }

    setContacts(allContacts)

    // Carregar mensagem personalizada
    const savedMessage = localStorage.getItem("emergency-message")
    if (savedMessage) {
      setEmergencyMessage(savedMessage)
    }
  }, [])

  useEffect(() => {
    // Scroll to form when isAddingContact becomes true
    if (isAddingContact) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [isAddingContact])

  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    setContacts(updatedContacts)
    // Salvar apenas contatos adicionais (não o principal que vem do settings)
    const additionalContacts = updatedContacts.filter(c => c.id !== "primary")
    localStorage.setItem("emergency-contacts-additional", JSON.stringify(additionalContacts))
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
    // Não permitir remover o contato primário
    if (id === "primary") {
      alert("O contato de emergência principal não pode ser removido. Altere-o em Configurações.")
      return
    }
    const updatedContacts = contacts.filter((contact) => contact.id !== id)
    saveContacts(updatedContacts)
  }

  const updateContact = (id: string, updatedData: Partial<EmergencyContact>) => {
    // Não permitir editar o contato primário
    if (id === "primary") {
      alert("O contato de emergência principal não pode ser editado aqui. Altere-o em Configurações.")
      return
    }
    const updatedContacts = contacts.map((contact) => (contact.id === id ? { ...contact, ...updatedData } : contact))
    saveContacts(updatedContacts)
    setEditingContact(null)
  }

  const sendEmergencyAlert = async () => {
    if (contacts.length === 0) {
      toast({
        title: "Nenhum contato cadastrado",
        description: "Adicione pelo menos um contato de emergência antes de enviar alertas.",
        variant: "destructive",
      })
      return
    }

    const confirmSend = confirm(
      `⚠️ ALERTA DE EMERGÊNCIA\n\nVocê está prestes a enviar alertas para ${contacts.length} contato(s):\n\n${contacts.map(c => `• ${c.name}`).join('\n')}\n\nMétodo: WhatsApp + Ligação telefônica\n\nDeseja prosseguir?`,
    )

    if (!confirmSend) return

    setIsSendingAlert(true)

    try {
      const token = localStorage.getItem('projeto-amparo-token')

      if (token) {
        // Tentar registrar no backend
        await fetch(`${getPublicBackendUrl()}/api/send-alert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            contacts: contacts.map(c => ({ name: c.name, phone: c.phone })),
            message: emergencyMessage,
          }),
        }).catch(err => {
          console.log('Backend not available, using fallback')
        })
      }

      // Usar WhatsApp + Ligação como método principal garantido
      toast({
        title: "🚨 Enviando alertas...",
        description: `Abrindo WhatsApp e discador para ${contacts.length} contato(s). Confirme cada mensagem.`,
      })

      // Enviar via WhatsApp para todos
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i]
        setTimeout(() => {
          sendWhatsAppMessage(contact.phone, contact.name)
          // Após 2 segundos, tentar ligar
          setTimeout(() => {
            const confirmCall = confirm(`Ligar para ${contact.name}?`)
            if (confirmCall) {
              callContact(contact.phone)
            }
          }, 2000)
        }, i * 3000) // Espaçar 3 segundos entre cada contato
      }

      // Registrar o envio
      const alertLog = {
        timestamp: new Date().toISOString(),
        contacts: contacts.length,
        method: 'whatsapp-call',
        message: emergencyMessage,
      }

      const logs = JSON.parse(localStorage.getItem("alert-logs") || "[]")
      logs.push(alertLog)
      localStorage.setItem("alert-logs", JSON.stringify(logs))

      setTimeout(() => {
        toast({
          title: "✅ Alertas iniciados",
          description: `Verifique que as mensagens de WhatsApp foram enviadas para ${contacts.length} contato(s).`,
        })
      }, contacts.length * 3000 + 1000)
    } catch (error) {
      console.error("Erro ao enviar alertas:", error)
      toast({
        title: "Erro ao enviar alertas",
        description: "Ligue diretamente para seus contatos.",
        variant: "destructive",
      })
    } finally {
      setIsSendingAlert(false)
    }
  }

  const saveEmergencyMessage = () => {
    localStorage.setItem("emergency-message", emergencyMessage)
    alert("Mensagem de emergência salva!")
  }

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '')
    
    // Format as +00 (00) 00000-0000 (5 digits before hyphen)
    if (digitsOnly.length <= 2) {
      return digitsOnly
    }
    if (digitsOnly.length <= 4) {
      return `+${digitsOnly.slice(0, 2)} (${digitsOnly.slice(2)}`
    }
    if (digitsOnly.length <= 9) {
      return `+${digitsOnly.slice(0, 2)} (${digitsOnly.slice(2, 4)}) ${digitsOnly.slice(4)}`
    }
    // Format as +00 (00) 00000-0000
    return `+${digitsOnly.slice(0, 2)} (${digitsOnly.slice(2, 4)}) ${digitsOnly.slice(4, 9)}-${digitsOnly.slice(9, 13)}`
  }

  const formatPhoneForTel = (phone: string): string => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '')
    // If it starts with 55 (Brazil country code), keep it, otherwise prepend 55
    if (digitsOnly.startsWith('55')) {
      return digitsOnly
    }
    return '55' + digitsOnly
  }

  const callContact = (phone: string) => {
    const formattedPhone = formatPhoneForTel(phone)
    window.location.href = `tel:+${formattedPhone}`
  }

  const sendWhatsAppMessage = (phone: string, contactName: string) => {
    // Limpar telefone de caracteres especiais
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(emergencyMessage)}`
    window.open(whatsappUrl, '_blank')
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
        {/* Info Card sobre Sincronização */}
        {contacts.find(c => c.isPrimary) && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                ℹ️ <strong>Contato de Emergência Principal:</strong> Este é o contato registrado em suas <Link href="/settings" className="underline font-semibold">Configurações</Link>. 
                Qualquer alteração em Configurações será automaticamente sincronizada aqui.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Botão de Alerta Rápido */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-red-800">⚠️ Alerta de Emergência</h2>
                  <p className="text-red-700 text-sm">Envie automaticamente para todos os seus contatos cadastrados</p>
                </div>
              </div>
              <Button
                onClick={sendEmergencyAlert}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2"
                disabled={contacts.length === 0 || isSendingAlert}
              >
                {isSendingAlert ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    ALERTAR AGORA
                  </>
                )}
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
                  Adicione um contato de emergência em Configurações ou aqui para receber alertas automáticos em emergências
                </p>
                <Button onClick={() => {
                  setIsAddingContact(true)
                }} className="bg-[#A459D1] hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Contato
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Contato Primário de Emergência */}
                {contacts.find(c => c.isPrimary) && (
                  <div className="border-2 border-[#A459D1] rounded-lg p-4 bg-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">⭐ {contacts.find(c => c.isPrimary)?.name}</h3>
                        <p className="text-sm text-gray-600">{contacts.find(c => c.isPrimary)?.phone}</p>
                        <p className="text-xs text-[#A459D1] font-semibold mt-1">CONTATO PRIMÁRIO - Sincronizado com Configurações</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => callContact(contacts.find(c => c.isPrimary)?.phone || "")}
                          className="bg-green-600 hover:bg-green-700"
                          title="Ligar"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => sendWhatsAppMessage(contacts.find(c => c.isPrimary)?.phone || "", contacts.find(c => c.isPrimary)?.name || "")}
                          className="bg-[#25D366] hover:bg-green-700"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contatos Adicionais */}
                {contacts.filter(c => !c.isPrimary).map((contact) => (
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
                            title="Ligar"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => sendWhatsAppMessage(contact.phone, contact.name)}
                            className="bg-[#25D366] hover:bg-green-700"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
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
          <Card className="mb-8" ref={formRef}>
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
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setNewContact((prev) => ({ ...prev, phone: formatted }))
                    }}
                    placeholder="Ex: +55 (11) 99999-9999"
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
