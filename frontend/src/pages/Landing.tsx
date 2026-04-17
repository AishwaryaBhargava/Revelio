import { useEffect, useState } from 'react'
import api from '../services/api'
import TranscriptPanel from '../components/transcript/TranscriptPanel'
import SuggestionsPanel from '../components/suggestions/SuggestionsPanel'
import ChatPanel from '../components/chat/ChatPanel'
import { useMic } from '../hooks/useMic'
import { useSuggestions } from '../hooks/useSuggestions'

export default function Landing() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const { isRecording, error, startMic, stopMic } = useMic()
  const { fetchSuggestions } = useSuggestions()

  useEffect(() => {
    api.get('/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('error'))
  }, [])

  function handleCardClick(card: { type: string; title: string; preview: string }) {
    setPendingMessage(`${card.title}: ${card.preview}`)
  }

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden">

      {/* Left Column - Transcript */}
      <div className="flex flex-col w-1/3 border-r border-gray-800 p-4">
        <TranscriptPanel
          isRecording={isRecording}
          error={error}
          startMic={startMic}
          stopMic={stopMic}
        />
      </div>

      {/* Middle Column - Suggestions */}
      <div className="flex flex-col w-1/3 border-r border-gray-800 p-4">
        <SuggestionsPanel
          isRecording={isRecording}
          onCardClick={handleCardClick}
          fetchSuggestions={fetchSuggestions}
        />
      </div>

      {/* Right Column - Chat */}
      <div className="flex flex-col w-1/3 p-4">
        <ChatPanel
          pendingMessage={pendingMessage}
          onPendingConsumed={() => setPendingMessage(null)}
        />
      </div>

      {/* Backend status indicator */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        Backend: {backendStatus}
      </div>

    </div>
  )
}