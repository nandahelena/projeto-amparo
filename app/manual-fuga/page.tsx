"use client"

import { useState, useRef } from "react"
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
  const printableRef = useRef<HTMLDivElement | null>(null)

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

  const generatePdfBlob = async (): Promise<Blob | null> => {
    try {
      if (!printableRef.current) return null
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const element = printableRef.current
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'pt', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      const blob = pdf.output('blob')
      return blob
    } catch (err) {
      console.error('Erro ao gerar PDF:', err)
      return null
    }
  }

  const handleDownload = async () => {
    const blob = await generatePdfBlob()
    if (!blob) {
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Não foi possível abrir a janela para impressão.')
        return
      }
      printWindow.document.write(document.documentElement.innerHTML)
      printWindow.document.close()
      printWindow.print()
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plano-seguranca.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    try {
      const blob = await generatePdfBlob()
      if (!blob) throw new Error('Não foi possível gerar o PDF')

      const file = new File([blob], 'plano-seguranca.pdf', { type: 'application/pdf' })

      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: 'Meu Plano de Segurança - Projeto Amparo', text: 'Plano de segurança pessoal criado com o Projeto Amparo' })
        return
      }

      if (navigator.share) {
        await navigator.share({ title: 'Meu Plano de Segurança - Projeto Amparo', text: 'Plano de segurança pessoal criado com o Projeto Amparo', url: window.location.href })
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    } catch (err) {
      console.error(err)
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copiado para a área de transferência!')
      } catch (_) {
        alert('Não foi possível compartilhar o plano.')
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
          {/* Printable area (off-screen) */}
          <div
            ref={printableRef}
            style={{
              position: 'absolute',
              left: -9999,
              top: 0,
              width: 794,
              background: '#ffffff',
              padding: 24,
              color: '#111',
              fontFamily: 'Arial, Helvetica, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <img src="/placeholder-logo.png" alt="Projeto Amparo" style={{ width: 86, height: 'auto' }} />
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: '#A459D1' }}>Projeto Amparo</h2>
                <div style={{ fontSize: 12, color: '#666' }}>Plano de Segurança Pessoal</div>
              </div>
            </div>

            <div style={{ borderTop: '2px solid #EEE', marginTop: 8, paddingTop: 8 }} />

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Situação Atual</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.situacaoAtual || '—'}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Local Seguro</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.localSeguro || '—'}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Contatos de Confiança</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.contatosConfianca || '—'}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Documentos Importantes</h3>
              <ul style={{ fontSize: 12, color: '#222', marginTop: 6 }}>
                {documentos.map((d) => (
                  <li key={d}>{formData.documentosImportantes.includes(d) ? '✔︎ ' : '◻︎ '}{d}</li>
                ))}
              </ul>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Recursos Financeiros</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.recursosFinanceiros || '—'}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Medidas de Segurança</h3>
              <ul style={{ fontSize: 12, color: '#222', marginTop: 6 }}>
                {medidasSeguranca.map((m) => (
                  <li key={m}>{formData.medidaSeguranca.includes(m) ? '✔︎ ' : '◻︎ '}{m}</li>
                ))}
              </ul>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Planejamento de Saída</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.planejamentoSaida || '—'}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: '6px 0', fontSize: 16, color: '#333' }}>Observações</h3>
              <div style={{ fontSize: 12, color: '#222' }}>{formData.observacoes || '—'}</div>
            </section>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white">
              <CardTitle>Plano de Segurança Pessoal</CardTitle>
              <CardDescription className="text-purple-100">Preencha as informações abaixo para criar seu plano de saída segura</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="situacao">Descreva brevemente sua situação atual</Label>
                  <Textarea id="situacao" placeholder="Descreva sua situação de forma que você se sinta confortável..." value={formData.situacaoAtual} onChange={(e) => setFormData((prev) => ({ ...prev, situacaoAtual: e.target.value }))} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="local-seguro">Local seguro para onde ir</Label>
                  <Input id="local-seguro" placeholder="Casa de familiar, amigo, abrigo, etc." value={formData.localSeguro} onChange={(e) => setFormData((prev) => ({ ...prev, localSeguro: e.target.value }))} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="contatos">Contatos de confiança</Label>
                  <Textarea id="contatos" placeholder="Nome e telefone de pessoas que podem ajudar..." value={formData.contatosConfianca} onChange={(e) => setFormData((prev) => ({ ...prev, contatosConfianca: e.target.value }))} className="mt-2" />
                </div>

                <div>
                  <Label className="text-base font-semibold">Documentos importantes para levar</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {documentos.map((documento) => (
                      <div key={documento} className="flex items-center space-x-2">
                        <Checkbox id={documento} checked={formData.documentosImportantes.includes(documento)} onCheckedChange={(checked) => handleDocumentChange(documento, checked as boolean)} />
                        <Label htmlFor={documento} className="text-sm">{documento}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="recursos">Recursos financeiros disponíveis</Label>
                  <Input id="recursos" placeholder="Dinheiro guardado, contas bancárias, etc." value={formData.recursosFinanceiros} onChange={(e) => setFormData((prev) => ({ ...prev, recursosFinanceiros: e.target.value }))} className="mt-2" />
                </div>

                <div>
                  <Label className="text-base font-semibold">Medidas de segurança a tomar</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {medidasSeguranca.map((medida) => (
                      <div key={medida} className="flex items-center space-x-2">
                        <Checkbox id={medida} checked={formData.medidaSeguranca.includes(medida)} onCheckedChange={(checked) => handleMedidaChange(medida, checked as boolean)} />
                        <Label htmlFor={medida} className="text-sm">{medida}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="planejamento">Planejamento detalhado da saída</Label>
                  <Textarea id="planejamento" placeholder="Descreva quando e como pretende sair, horários seguros, transporte, etc." value={formData.planejamentoSaida} onChange={(e) => setFormData((prev) => ({ ...prev, planejamentoSaida: e.target.value }))} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações adicionais</Label>
                  <Textarea id="observacoes" placeholder="Outras informações importantes para seu plano..." value={formData.observacoes} onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleShare} className="bg-[#A459D1] hover:bg-purple-600 flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Plano Seguro
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Salvar como PDF
            </Button>
          </div>

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
"use client"

