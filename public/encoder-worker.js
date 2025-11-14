// Worker to encode PCM Float32 arrays into MP3 using lamejs loaded from CDN
// This file is served statically from /encoder-worker.js

// Load lamejs from CDN
try {
  importScripts('https://unpkg.com/lamejs@1.2.1/lame.min.js')
} catch (e) {
  // importScripts may fail if offline; worker will throw later
  console.error('Failed to import lamejs in worker', e)
}

self.onmessage = function (e) {
  const data = e.data
  if (!data || !data.cmd) return

  if (data.cmd === 'encode') {
    const id = data.id
    const left = new Float32Array(data.left)
    const right = data.right ? new Float32Array(data.right) : null
    const sampleRate = data.sampleRate || 44100
    const numChannels = right ? 2 : 1

    try {
      // lamejs is expected to be available as lamejs or Lame or self.lamejs
      const Lame = (self.lamejs || self.Lame || self.lamejs)
      const Mp3Encoder = Lame && Lame.Mp3Encoder ? Lame.Mp3Encoder : (self.Mp3Encoder || (Lame && Lame.Mp3Encoder))
      if (!Mp3Encoder) throw new Error('Mp3Encoder not found in worker (lamejs not loaded)')

      const mp3Encoder = new Mp3Encoder(numChannels, sampleRate, 128)
      const maxSamples = 1152
      const mp3Data = []

      const floatTo16BitPCM = (float32Array) => {
        const out = new Int16Array(float32Array.length)
        for (let i = 0; i < float32Array.length; i++) {
          let s = Math.max(-1, Math.min(1, float32Array[i]))
          out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
        }
        return out
      }

      for (let i = 0; i < left.length; i += maxSamples) {
        const leftChunk = left.subarray(i, i + maxSamples)
        const rightChunk = right ? right.subarray(i, i + maxSamples) : null

        const left16 = floatTo16BitPCM(leftChunk)
        const right16 = rightChunk ? floatTo16BitPCM(rightChunk) : null

        let mp3buf
        if (right16) mp3buf = mp3Encoder.encodeBuffer(left16, right16)
        else mp3buf = mp3Encoder.encodeBuffer(left16)

        if (mp3buf && mp3buf.length > 0) mp3Data.push(mp3buf)

        // report progress
        const percent = Math.floor((i / left.length) * 100)
        self.postMessage({ type: 'progress', id, percent })
      }

      const end = mp3Encoder.flush()
      if (end && end.length > 0) mp3Data.push(end)

      // concat
      let size = 0
      for (let i = 0; i < mp3Data.length; i++) size += mp3Data[i].length
      const result = new Uint8Array(size)
      let offset = 0
      for (let i = 0; i < mp3Data.length; i++) {
        result.set(mp3Data[i], offset)
        offset += mp3Data[i].length
      }

      // send back as transferable
      self.postMessage({ type: 'done', id, mp3: result.buffer }, [result.buffer])
    } catch (err) {
      self.postMessage({ type: 'error', id, message: err.message || String(err) })
    }
  }
}
