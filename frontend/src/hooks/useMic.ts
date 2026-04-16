import { useRef, useState } from 'react'
import api from '../services/api'
import { useTranscriptStore } from '../store/transcriptStore'

const CHUNK_INTERVAL_MS = 30000

export function useMic() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const addChunk = useTranscriptStore((s) => s.addChunk)

  async function sendAudioChunk(blob: Blob) {
    if (blob.size === 0) return
    try {
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      const response = await api.post('/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.data.text?.trim()) {
        addChunk(response.data.text.trim())
      }
    } catch (err) {
      console.error('Transcription error:', err)
    }
  }

  async function startMic() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      startRecordingCycle(stream)
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied. Please allow mic permission and try again.')
    }
  }

  function startRecordingCycle(stream: MediaStream) {
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = recorder

    const chunks: BlobPart[] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      sendAudioChunk(blob)
      chunks.length = 0
    }

    recorder.start()

    intervalRef.current = setInterval(() => {
      if (recorder.state === 'recording') {
        recorder.stop()
        const newRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
        mediaRecorderRef.current = newRecorder
        const newChunks: BlobPart[] = []
        newRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) newChunks.push(e.data)
        }
        newRecorder.onstop = () => {
          const blob = new Blob(newChunks, { type: 'audio/webm' })
          sendAudioChunk(blob)
          newChunks.length = 0
        }
        newRecorder.start()
        mediaRecorderRef.current = newRecorder
      }
    }, CHUNK_INTERVAL_MS)
  }

  function stopMic() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  return { isRecording, error, startMic, stopMic }
}