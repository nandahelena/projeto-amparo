"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Share2, Download, Shield } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function ManualFugaPage() {
  const [formData, setFormData] = useState({
    situacaoAtual: "",
    localSeguro: "",
    contatosConfianca: "",
    documentosImportantes: [] as string[],
    recursosFinanceiros: "",
    planejamentoSaida: "",
    medidaSeguranca: [] as string[],
    observacoes: "",
  })

  const documentos = [
    "RG/CPF",
    "Certidão de nascimento (própria e dos filhos)",
    "Carteira de trabalho",
    "Comprovante de renda",
    "Comprovante de residência",
    "Cartão do SUS",
    "Medicamentos essenciais",
    "Chaves extras",
    "Cartões bancários",
    "Documentos dos filhos (escola, saúde)",
  ]

  const medidasSeguranca = [
    "Informar pessoa de confiança sobre o plano",
    "Preparar bolsa com itens essenciais",
    "Guardar dinheiro em local seguro",
    "Memorizar números de emergência",
    "Identificar rotas de fuga",
    "Preparar os filhos (se houver)",
    "Documentar evidências de violência",
    "Buscar orientação jurídica prévia",
  ]

  const handleDocumentChange = (documento: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      documentosImportantes: checked
        ? [...prev.documentosImportantes, documento]
        : prev.documentosImportantes.filter((d) => d !== documento),
    }))
  }

  const handleMedidaChange = (medida: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      medidaSeguranca: checked ? [...prev.medidaSeguranca, medida] : prev.medidaSeguranca.filter((m) => m !== medida),
    }))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Plano de Segurança - Projeto Amparo",
        text: "Plano de segurança pessoal criado com o Projeto Amparo",
        url: window.location.href,
      })
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
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
              <Shield className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Manual de Fuga</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white">
            <CardTitle>Plano de Segurança Pessoal</CardTitle>
            <CardDescription className="text-purple-100">
              Preencha as informações abaixo para criar seu plano de saída segura
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Situação Atual */}
              <div>
                <Label htmlFor="situacao">Descreva brevemente sua situação atual</Label>
                <Textarea
                  id="situacao"
                  placeholder="Descreva sua situação de forma que você se sinta confortável..."
                  value={formData.situacaoAtual}
                  onChange={(e) => setFormData((prev) => ({ ...prev, situacaoAtual: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Local Seguro */}
              <div>
                <Label htmlFor="local-seguro">Local seguro para onde ir</Label>
                <Input
                  id="local-seguro"
                  placeholder="Casa de familiar, amigo, abrigo, etc."
                  value={formData.localSeguro}
                  onChange={(e) => setFormData((prev) => ({ ...prev, localSeguro: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Contatos de Confiança */}
              <div>
                <Label htmlFor="contatos">Contatos de confiança</Label>
                <Textarea
                  id="contatos"
                  placeholder="Nome e telefone de pessoas que podem ajudar..."
                  value={formData.contatosConfianca}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contatosConfianca: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Documentos Importantes */}
              <div>
                <Label className="text-base font-semibold">Documentos importantes para levar</Label>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {documentos.map((documento) => (
                    <div key={documento} className="flex items-center space-x-2">
                      <Checkbox
                        id={documento}
                        checked={formData.documentosImportantes.includes(documento)}
                        onCheckedChange={(checked) => handleDocumentChange(documento, checked as boolean)}
                      />
                      <Label htmlFor={documento} className="text-sm">
                        {documento}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recursos Financeiros */}
              <div>
                <Label htmlFor="recursos">Recursos financeiros disponíveis</Label>
                <Input
                  id="recursos"
                  placeholder="Dinheiro guardado, contas bancárias, etc."
                  value={formData.recursosFinanceiros}
                  onChange={(e) => setFormData((prev) => ({ ...prev, recursosFinanceiros: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Medidas de Segurança */}
              <div>
                <Label className="text-base font-semibold">Medidas de segurança a tomar</Label>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {medidasSeguranca.map((medida) => (
                    <div key={medida} className="flex items-center space-x-2">
                      <Checkbox
                        id={medida}
                        checked={formData.medidaSeguranca.includes(medida)}
                        onCheckedChange={(checked) => handleMedidaChange(medida, checked as boolean)}
                      />
                      <Label htmlFor={medida} className="text-sm">
                        {medida}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Planejamento da Saída */}
              <div>
                <Label htmlFor="planejamento">Planejamento detalhado da saída</Label>
                <Textarea
                  id="planejamento"
                  placeholder="Descreva quando e como pretende sair, horários seguros, transporte, etc."
                  value={formData.planejamentoSaida}
                  onChange={(e) => setFormData((prev) => ({ ...prev, planejamentoSaida: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações adicionais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Outras informações importantes para seu plano..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleShare} className="bg-[#A459D1] hover:bg-purple-600 flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar Plano Seguro
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Salvar como PDF
          </Button>
        </div>

        {/* Informações de Segurança */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">⚠️ Importante para sua segurança:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Mantenha este plano em local seguro e sigiloso</li>
              <li>• Compartilhe apenas com pessoas de extrema confiança</li>
              <li>• Atualize o plano sempre que necessário</li>
              <li>• Em emergência, ligue 190 (Polícia) ou 180 (Central da Mulher)</li>
              <li>• Procure sempre orientação profissional especializada</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  )
}
