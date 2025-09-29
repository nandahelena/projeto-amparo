import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mic, AlertTriangle, Heart, MapPin, MessageCircle, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-[#A459D1] rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-[#A459D1]">Projeto Amparo</h1>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/auth/login">
                <Button size="sm" className="bg-[#A459D1] hover:bg-purple-600 text-white">
                  Entrar
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex mt-4 space-x-1 overflow-x-auto items-center">
            <Link
              href="/manual-fuga"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Manual de Fuga
            </Link>
            <Link
              href="/discagem-direta"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Discagem Direta
            </Link>
            <Link
              href="/gravar-audio"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Gravar Áudio
            </Link>
            <Link
              href="/chat-juridico"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Chat Jurídico
            </Link>
            <Link
              href="/botao-panico"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Botão de Pânico
            </Link>
            <Link
              href="/apoio-psicologico"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Apoio Psicológico
            </Link>
            <Link
              href="/recursos-proximos"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Recursos Próximos
            </Link>
            <Link
              href="/contatos-emergencia"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#A459D1] hover:bg-purple-50 rounded-md whitespace-nowrap"
            >
              Contatos de Emergência
            </Link>

            {/* Botão de Login */}
            <div className="ml-4 pl-4 border-l border-gray-200">
              <Link href="/auth/login">
                <Button className="bg-[#A459D1] hover:bg-purple-600 text-white">Entrar</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Botão de Pânico - Destaque no topo */}
        <div className="mb-8">
          <Link href="/botao-panico">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-bold shadow-lg">
              <AlertTriangle className="w-8 h-8 mr-3" />
              BOTÃO DE PÂNICO - EMERGÊNCIA
            </Button>
          </Link>
        </div>

        {/* Ajuda Imediata Panel */}
        <Card className="mb-8 border-[#A459D1] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white">
            <CardTitle className="text-2xl text-center">Ajuda Imediata</CardTitle>
            <CardDescription className="text-purple-100 text-center">
              Recursos de emergência disponíveis 24 horas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Gravar Áudio */}
              <div className="text-center">
                <Link href="/gravar-audio">
                  <Button className="w-full h-24 bg-[#A459D1] hover:bg-purple-600 text-white mb-3 flex flex-col items-center justify-center">
                    <Mic className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Gravar Áudio</span>
                  </Button>
                </Link>
                <p className="text-sm text-gray-600">
                  Inicia gravação automaticamente e salva na nuvem com opção de compartilhar
                </p>
              </div>

              {/* Alertar Contatos */}
              <div className="text-center">
                <Link href="/contatos-emergencia">
                  <Button className="w-full h-24 bg-orange-500 hover:bg-orange-600 text-white mb-3 flex flex-col items-center justify-center">
                    <MessageCircle className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Alertar Contatos</span>
                  </Button>
                </Link>
                <p className="text-sm text-gray-600">Envia SMS imediato para os contatos cadastrados de emergência</p>
              </div>

              {/* Ligar 190 */}
              <div className="text-center">
                <Link href="/discagem-direta">
                  <Button className="w-full h-24 bg-red-600 hover:bg-red-700 text-white mb-3 flex flex-col items-center justify-center">
                    <Phone className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Ligar 190</span>
                  </Button>
                </Link>
                <p className="text-sm text-gray-600">
                  Faz ligação direta para a Polícia Militar se o dispositivo permitir
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citação de Impacto */}
        <div className="text-center mb-8 py-8 bg-white rounded-lg shadow-md border-l-4 border-[#A459D1]">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic">
            "Romper o silêncio é o primeiro passo para a liberdade."
          </blockquote>
        </div>

        {/* Sobre o Projeto */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#A459D1] flex items-center">
              <Heart className="w-6 h-6 mr-2" />O que é o Projeto Amparo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              O Projeto Amparo é uma plataforma digital dedicada ao apoio integral de mulheres vítimas de violência
              sexual. Oferecemos suporte jurídico, psicossocial e comunitário através de recursos tecnológicos seguros e
              acessíveis.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nossa missão é proporcionar ferramentas de proteção, orientação e acolhimento, conectando mulheres em
              situação de vulnerabilidade com redes de apoio especializadas e recursos de emergência.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Acreditamos que toda mulher merece viver livre de violência, com dignidade e segurança. O Projeto Amparo
              está aqui para apoiar você em cada passo dessa jornada.
            </p>
          </CardContent>
        </Card>

        {/* Recursos Adicionais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/manual-fuga">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Manual de Fuga</h3>
                <p className="text-sm text-gray-600">Planeje sua saída com segurança</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat-juridico">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Chat Jurídico</h3>
                <p className="text-sm text-gray-600">Tire dúvidas sobre seus direitos</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/apoio-psicologico">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Apoio Psicológico</h3>
                <p className="text-sm text-gray-600">Redes de apoio gratuitas</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recursos-proximos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-[#A459D1] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Recursos Próximos</h3>
                <p className="text-sm text-gray-600">Serviços na sua região</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#A459D1] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Siga-nos nas redes sociais</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://instagram.com/amparoofc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@amparoofc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span className="sr-only">TikTok</span>
              </a>
            </div>
            <p className="mt-2 text-purple-200">@amparoofc</p>
          </div>
          <div className="border-t border-purple-400 pt-4">
            <p className="text-sm text-purple-200">© 2024 Projeto Amparo. Todos os direitos reservados.</p>
            <p className="text-xs text-purple-300 mt-1">
              Em caso de emergência, ligue 190 (Polícia) ou 180 (Central de Atendimento à Mulher)
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
