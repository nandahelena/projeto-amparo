import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Projeto Amparo - Apoio a Mulheres Vítimas de Violência",
  description:
    "Plataforma de apoio integral para mulheres vítimas de violência sexual, oferecendo suporte jurídico, psicossocial e recursos de emergência.",
  keywords: "violência contra mulher, apoio psicológico, assistência jurídica, medidas protetivas, emergência",
  authors: [{ name: "Projeto Amparo" }],
  icons: {
    icon: "/LOGO-AMPARO.jpeg.jpg",
  },
  openGraph: {
    title: "Projeto Amparo - Apoio a Mulheres Vítimas de Violência",
    description: "Plataforma de apoio integral para mulheres vítimas de violência sexual",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
