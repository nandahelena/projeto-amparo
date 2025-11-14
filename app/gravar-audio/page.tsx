"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Download, MapPin, Clock } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { ProtectedRoute } from "@/components/ProtectedRoute"

interface AudioRecording {
  id: string
  name: string
  date: string
  time: string
  duration: string
  location?: string
  blob?: Blob
}

export default function GravarAudioPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [currentTime, setCurrentTime] = useState("00:00")
  const [location, setLocation] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    // Solicitar localização quando o componente carrega
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
          setLocation("Localização não disponível")
        },
      )
    }

    // Carregar gravações salvas
    const savedRecordings = localStorage.getItem("projeto-amparo-recordings")
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings))
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        const now = new Date()
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)

        const newRecording: AudioRecording = {
          id: Date.now().toString(),
          name: `Gravação ${recordings.length + 1}`,
          date: now.toLocaleDateString("pt-BR"),
          time: now.toLocaleTimeString("pt-BR"),
          duration: formatDuration(duration),
          location: location,
          blob: blob,
        }

        const updatedRecordings = [...recordings, newRecording]
        setRecordings(updatedRecordings)
        localStorage.setItem("projeto-amparo-recordings", JSON.stringify(updatedRecordings))

        // Parar todas as faixas de áudio
        stream.getTracks().forEach((track) => track.stop())
      }

      startTimeRef.current = Date.now()
      mediaRecorder.start()
      setIsRecording(true)

      // Iniciar timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setCurrentTime(formatDuration(elapsed))
      }, 1000)
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error)
      alert("Erro ao acessar o microfone. Verifique as permissões.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setCurrentTime("00:00")

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const shareRecording = (recording: AudioRecording) => {
    if (navigator.share && recording.blob) {
      const file = new File([recording.blob], `${recording.name}.wav`, { type: "audio/wav" })
      navigator
        .share({
          title: recording.name,
          text: `Gravação de áudio - ${recording.date} ${recording.time}`,
          files: [file],
        })
        .catch(console.error)
    } else {
      alert("Compartilhamento não disponível neste dispositivo")
    }
  }

  const downloadRecording = (recording: AudioRecording) => {
    if (recording.blob) {
      const url = URL.createObjectURL(recording.blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${recording.name}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <BackButton />
            <div className="flex items-center space-x-3">
              <Mic className="w-8 h-8 text-[#A459D1]" />
              <h1 className="text-2xl font-bold text-[#A459D1]">Gravar Áudio</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Gravador Principal */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-[#A459D1] to-purple-600 text-white">
            <CardTitle className="text-center">Gravação de Áudio</CardTitle>
            <CardDescription className="text-purple-100 text-center">
              Grave evidências de áudio de forma segura e automática
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Timer */}
              <div className="text-4xl font-mono font-bold text-[#A459D1]">{currentTime}</div>

              {/* Botão de Gravação */}
              <div>
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Mic className="w-12 h-12" />
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="w-32 h-32 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <Square className="w-12 h-12" />
                  </Button>
                )}
              </div>

              <p className="text-gray-600">
                {isRecording ? "Gravando... Toque para parar" : "Toque para iniciar a gravação"}
              </p>

              {/* Informações da Localização */}
              {location && (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Localização: {location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Gravações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#A459D1]">Histórico de Gravações</CardTitle>
            <CardDescription>Suas gravações são salvas automaticamente com data, hora e localização</CardDescription>
          </CardHeader>
          <CardContent>
            {recordings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma gravação encontrada. Faça sua primeira gravação acima.
              </p>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{recording.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recording.date} às {recording.time}
                          </span>
                          <span>Duração: {recording.duration}</span>
                        </div>
                        {recording.location && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {recording.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => downloadRecording(recording)}>
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">🔒 Segurança e Privacidade:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• As gravações são salvas localmente no seu dispositivo</li>
              <li>• Inclui automaticamente data, hora e localização (se permitida)</li>
              <li>• Você controla quando e com quem compartilhar</li>
              <li>• Mantenha backups seguros das gravações importantes</li>
              <li>• Use fones de ouvido para maior discrição</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  )
}
