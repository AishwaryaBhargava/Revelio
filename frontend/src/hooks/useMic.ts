import { useRef, useState, useCallback } from 'react'
import api from '../services/api'
import { useTranscriptStore } from '../store/transcriptStore'
import { useSuggestionsStore } from '../store/suggestionsStore'

const CHUNK_INTERVAL_MS = 30000

async function fetchSuggestionsNow() {
  const chunks = useTranscriptStore.getState().chunks
  const transcript = chunks.map((c) => c.text).join(' ')
  const { setLoading, addBatch } = useSuggestionsStore.getState()
  setLoading(true)
  try {
    const response = await api.post('/suggestions', {
      transcript,
      context_window_words: 400,
    })
    addBatch(response.data.cards)
  } catch (err: any) {
    if (err?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('revelio:auth-error', { detail: 'Invalid or missing Groq API key. Please check your key in Settings.' }))
    } else {
      console.error('Suggestions error:', err)
    }
  } finally {
    setLoading(false)
  }
}

async function sendAudioChunk(blob: Blob) {
  if (blob.size === 0) return
  try {
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')
    const response = await api.post('/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (response.data.text?.trim()) {
      useTranscriptStore.getState().addChunk(response.data.text.trim())
      await fetchSuggestionsNow()
    }
  } catch (err: any) {
    if (err?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('revelio:auth-error', { detail: 'Invalid or missing Groq API key. Please check your key in Settings.' }))
    } else {
      console.error('Transcription error:', err)
    }
  }
}

function createRecorder(stream: MediaStream): MediaRecorder {
  const chunks: BlobPart[] = []
  const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' })
    sendAudioChunk(blob)
    chunks.length = 0
  }

  recorder.start()
  return recorder
}

export function useMic() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startMic = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      mediaRecorderRef.current = createRecorder(stream)

      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
        if (streamRef.current) {
          mediaRecorderRef.current = createRecorder(streamRef.current)
        }
      }, CHUNK_INTERVAL_MS)

      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied. Please allow mic permission and try again.')
    }
  }, [])

  const stopMic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsRecording(false)
  }, [])

  return { isRecording, error, startMic, stopMic }
}