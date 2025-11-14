"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mic, Square, Download, Share2, MapPin, Clock, Trash2 } from "lucide-react"

interface AudioRecording {
  id: string
  name: string
  date: string
  time: string
  duration: string
  location?: string
  // `dataUrl` é persistível (localStorage). `blob` fica em memória na sessão atual.
  dataUrl?: string
  blob?: Blob
}

export default function GravarAudioPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [currentTime, setCurrentTime] = useState("00:00")
  const [location, setLocation] = useState<string>("")
  const [currentMime, setCurrentMime] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const workerRef = useRef<Worker | null>(null)

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
      try {
        const parsed: AudioRecording[] = JSON.parse(savedRecordings)
        setRecordings(parsed)
      } catch (e) {
        console.error("Erro ao parsear gravações salvas:", e)
      }
    }

    // cleanup: terminate worker when component unmounts
    return () => {
      if (workerRef.current) {
        try {
          workerRef.current.terminate()
        } catch (e) {
          console.warn('Erro ao terminar worker:', e)
        }
        workerRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Determinar mimeType preferível para o MediaRecorder
      let mimeType = ""
      if ((window as any).MediaRecorder && (MediaRecorder as any).isTypeSupported) {
        // Priorizar codecs modernos e amplamente suportados. Tentar webm/opus, ogg/opus, mp4/aac, depois mp3.
        if ((MediaRecorder as any).isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus"
        } else if ((MediaRecorder as any).isTypeSupported("audio/ogg;codecs=opus")) {
          mimeType = "audio/ogg;codecs=opus"
        } else if ((MediaRecorder as any).isTypeSupported("audio/mp4;codecs=mp4a.40.2")) {
          mimeType = "audio/mp4;codecs=mp4a.40.2"
        } else if ((MediaRecorder as any).isTypeSupported("audio/mpeg")) {
          // É raro que MediaRecorder grave direto em mp3, mas checamos por segurança
          mimeType = "audio/mpeg"
        }
      }
  const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
  // Guardar o mime usado para exibir ao usuário e quando salvar o blob
  setCurrentMime(mimeType || (mediaRecorder && (mediaRecorder as any).mimeType) || "audio/webm")

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const actualType = mediaRecorder.mimeType || (chunksRef.current[0] && (chunksRef.current[0] as Blob).type) || "audio/webm"
        const blob = new Blob(chunksRef.current, { type: actualType })
        const now = new Date()
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)

        // Converter para mp3 usando lamejs (client-side). Se falhar, salva o blob original.
        ;(async () => {
          try {
            const mp3Blob = await convertBlobToMp3(blob)

            const reader = new FileReader()
            reader.onload = () => {
              const dataUrl = reader.result as string

              // Use functional update to avoid stale state when multiple recordings are added quickly
              setRecordings((prev) => {
                const newRecording: AudioRecording = {
                  id: Date.now().toString(),
                  name: `Gravação ${prev.length + 1}`,
                  date: now.toLocaleDateString("pt-BR"),
                  time: now.toLocaleTimeString("pt-BR"),
                  duration: formatDuration(duration),
                  location: location,
                  dataUrl,
                  blob: mp3Blob,
                }
                const updatedRecordings = [...prev, newRecording]
                try {
                  localStorage.setItem("projeto-amparo-recordings", JSON.stringify(updatedRecordings))
                } catch (err) {
                  console.error("Erro ao salvar gravação no localStorage (tamanho?):", err)
                  alert("Não foi possível salvar a gravação localmente. O espaço do dispositivo pode estar cheio.")
                }
                return updatedRecordings
              })
            }
            reader.onerror = (e) => console.error("Erro ao criar dataUrl do mp3:", e)
            reader.readAsDataURL(mp3Blob)
          } catch (err) {
            console.error("Erro ao converter para mp3, salvando original:", err)
            // fallback: salvar blob original
            const reader = new FileReader()
            reader.onload = () => {
              const dataUrl = reader.result as string
              setRecordings((prev) => {
                const newRecording: AudioRecording = {
                  id: Date.now().toString(),
                  name: `Gravação ${prev.length + 1}`,
                  date: now.toLocaleDateString("pt-BR"),
                  time: now.toLocaleTimeString("pt-BR"),
                  duration: formatDuration(duration),
                  location: location,
                  dataUrl,
                  blob,
                }
                const updatedRecordings = [...prev, newRecording]
                try {
                  localStorage.setItem("projeto-amparo-recordings", JSON.stringify(updatedRecordings))
                } catch (err) {
                  console.error("Erro ao salvar gravação no localStorage (tamanho?):", err)
                  alert("Não foi possível salvar a gravação localmente. O espaço do dispositivo pode estar cheio.")
                }
                return updatedRecordings
              })
            }
            reader.onerror = (e) => console.error("Erro ao criar dataUrl do fallback blob:", e)
            reader.readAsDataURL(blob)
          } finally {
            // Parar todas as faixas de áudio
            stream.getTracks().forEach((track) => track.stop())
          }
        })()
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

  // Converte um Blob de áudio (webm/ogg/mp4...) para MP3 usando a Web Worker em /encoder-worker.js
  const convertBlobToMp3 = async (inputBlob: Blob): Promise<Blob> => {
    try {
      // decode audio to PCM in main thread
      const arrayBuffer = await inputBlob.arrayBuffer()
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContext()

      const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
        audioCtx.decodeAudioData(
          arrayBuffer.slice(0),
          (buf: AudioBuffer) => resolve(buf),
          (err: any) => reject(err),
        )
      })

      const numChannels = audioBuffer.numberOfChannels
      const sampleRate = audioBuffer.sampleRate || 44100
      const left = audioBuffer.getChannelData(0)
      const right = numChannels > 1 ? audioBuffer.getChannelData(1) : null

      // init worker if needed
      if (!workerRef.current) {
        try {
          workerRef.current = new Worker('/encoder-worker.js')
        } catch (err) {
          throw new Error('Não foi possível criar worker de encoding: ' + String(err))
        }
      }

      const worker = workerRef.current

      return await new Promise<Blob>((resolve, reject) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2, 9)

        const onMessage = (ev: MessageEvent) => {
          const msg = ev.data
          if (!msg || msg.id !== id) return
          if (msg.type === 'progress') {
            // opcional: atualizar UI com progresso (console por enquanto)
            // console.log('MP3 encoding progress', msg.percent)
            return
          }
          if (msg.type === 'done') {
            worker.removeEventListener('message', onMessage)
            const mp3Buffer = msg.mp3
            const uint8 = new Uint8Array(mp3Buffer)
            resolve(new Blob([uint8], { type: 'audio/mpeg' }))
          } else if (msg.type === 'error') {
            worker.removeEventListener('message', onMessage)
            reject(new Error(msg.message || 'Erro no worker'))
          }
        }

        worker.addEventListener('message', onMessage)

        try {
          // Transfer buffers to worker
          const transfer = [left.buffer]
          const payload: any = { cmd: 'encode', id, left: left.buffer, sampleRate }
          if (right) {
            payload.right = right.buffer
            transfer.push(right.buffer)
          }

          worker.postMessage(payload, transfer)
        } catch (err) {
          worker.removeEventListener('message', onMessage)
          reject(err)
        }
      })
    } catch (err) {
      console.error('convertBlobToMp3 erro:', err)
      throw err
    }
  }

  const deleteRecording = (id: string) => {
    if (!confirm("Excluir esta gravação?")) return
    const updated = recordings.filter((r) => r.id !== id)
    setRecordings(updated)
    try {
      localStorage.setItem("projeto-amparo-recordings", JSON.stringify(updated))
    } catch (err) {
      console.error("Erro ao atualizar gravações no localStorage:", err)
    }
  }

  const shareRecording = async (recording: AudioRecording) => {
    // Verifica se a API de compartilhamento existe
    if (typeof navigator === "undefined" || !navigator.share) {
      alert("Compartilhamento não disponível neste dispositivo")
      return
    }

    const canShareFiles = (files: File[]) => {
      try {
        // @ts-ignore
        if (navigator.canShare) return (navigator as any).canShare({ files })
      } catch (e) {
        return false
      }
      return false
    }

    const doShareWithBlob = async (blob: Blob) => {
      const ext = (blob.type && blob.type.split("/")[1]) || "mp3"
      const file = new File([blob], `${recording.name}.${ext}`, { type: blob.type })

      // Se o ambiente suporta compartilhamento de arquivos
      if (canShareFiles([file])) {
        try {
          await navigator.share({
            title: recording.name,
            text: `Gravação de áudio - ${recording.date} ${recording.time}`,
            files: [file],
          })
          return true
        } catch (err) {
          console.error("Erro ao compartilhar (com files):", err)
          return false
        }
      }

      // Fallback: tentar compartilhar apenas texto (sem arquivo)
      try {
        await navigator.share({
          title: recording.name,
          text: `Gravação de áudio - ${recording.date} ${recording.time}`,
        })
        // Avisar o usuário que o arquivo não foi incluído
        alert("Seu dispositivo não suporta compartilhamento de arquivos — será oferecido o download do arquivo para que você possa compartilhá-lo manualmente.")
        return false
      } catch (err) {
        console.error("Erro ao compartilhar (texto):", err)
        return false
      }
    }

    try {
      if (recording.blob) {
        // Se não for mp3, converter antes de compartilhar
        if (recording.blob.type !== "audio/mpeg") {
          try {
            const mp3 = await convertBlobToMp3(recording.blob)
            const ok = await doShareWithBlob(mp3)
            if (!ok) downloadRecording({ ...recording, blob: mp3 })
          } catch (err) {
            // fallback: compartilhar o blob original
            const ok = await doShareWithBlob(recording.blob)
            if (!ok) downloadRecording(recording)
          }
        } else {
          const ok = await doShareWithBlob(recording.blob)
          if (!ok) downloadRecording(recording)
        }
        return
      }

      if (recording.dataUrl) {
        const fetched = await fetch(recording.dataUrl)
        const fetchedBlob = await fetched.blob()
        if (fetchedBlob.type !== "audio/mpeg") {
          try {
            const mp3 = await convertBlobToMp3(fetchedBlob)
            const ok = await doShareWithBlob(mp3)
            if (!ok) downloadRecording({ ...recording, blob: mp3 })
          } catch (err) {
            const ok = await doShareWithBlob(fetchedBlob)
            if (!ok) downloadRecording(recording)
          }
        } else {
          const ok = await doShareWithBlob(fetchedBlob)
          if (!ok) downloadRecording(recording)
        }
        return
      }
    } catch (err) {
      console.error("Erro no processo de compartilhamento:", err)
      alert("Não foi possível compartilhar a gravação")
      return
    }

    alert("Gravação não disponível para compartilhamento")
  }

  const downloadRecording = (recording: AudioRecording) => {
    if (recording.dataUrl) {
      const a = document.createElement("a")
      a.href = recording.dataUrl
      // tentar inferir extensão do MIME
      const ext = recording.dataUrl.split(",")[0].match(/data:audio\/(.+);/)?.[1] || "webm"
      a.download = `${recording.name}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    if (recording.blob) {
      const url = URL.createObjectURL(recording.blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${recording.name}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Verificações de suporte para UI
  const isMediaRecorderSupported = typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia

  return (
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
              {/* Formato de gravação atual */}
              {currentMime && (
                <div className="text-sm text-gray-500">Formato: {currentMime}</div>
              )}

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
                      <Button size="sm" variant="outline" onClick={() => shareRecording(recording)}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Compartilhar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteRecording(recording.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
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
  )
}
