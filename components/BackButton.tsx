"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  // Se está logado, volta para dashboard. Senão, volta para home
  const href = typeof window !== 'undefined' && localStorage.getItem('projeto-amparo-token') 
    ? '/dashboard' 
    : '/'

  return (
    <Link href={href} className="inline-flex items-center text-[#A459D1] hover:text-purple-600 mb-4">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar
    </Link>
  )
}
