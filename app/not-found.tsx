"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-4xl font-bold text-[#A459D1] mb-4">404</h2>
        <p className="text-xl text-gray-800 mb-2">Página não encontrada</p>
        <p className="text-gray-600 mb-6">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link href="/dashboard">
          <Button className="bg-[#A459D1] hover:bg-purple-700 text-white">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
