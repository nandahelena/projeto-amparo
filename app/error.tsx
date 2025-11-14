"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-[#A459D1] mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-6">
          Desculpe, ocorreu um erro ao carregar a página. Tente novamente.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-[#A459D1] hover:bg-purple-700 text-white"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
