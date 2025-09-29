"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

// Tornar a página dinâmica
export const dynamic = "force-dynamic"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-[#A459D1] hover:text-purple-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[#A459D1] rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-[#A459D1]">Projeto Amparo</h1>
          </div>
        </div>

        {/* Verification Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-[#A459D1]">Verifique seu email</CardTitle>
            <CardDescription>Enviamos um link de confirmação para o seu email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">Conta criada com sucesso!</span>
                </div>
                <p className="text-sm text-blue-700">
                  Para ativar sua conta e fazer login, clique no link que enviamos para seu email.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Próximos passos:</h3>
                <ol className="text-sm text-gray-600 space-y-1 text-left">
                  <li>1. Verifique sua caixa de entrada</li>
                  <li>2. Clique no link de confirmação</li>
                  <li>3. Faça login na sua conta</li>
                  <li>4. Comece a usar o Projeto Amparo</li>
                </ol>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  <strong>Não recebeu o email?</strong> Verifique sua pasta de spam ou lixo eletrônico.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full bg-[#A459D1] hover:bg-purple-600">Ir para Login</Button>
              </Link>

              <Button variant="outline" className="w-full bg-transparent">
                Reenviar Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card className="mt-6 border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">💬 Precisa de ajuda?</h3>
            <p className="text-sm text-gray-600">
              Se você não conseguir ativar sua conta, entre em contato conosco através das redes sociais{" "}
              <strong>@amparoofc</strong> ou pelos canais de emergência.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
