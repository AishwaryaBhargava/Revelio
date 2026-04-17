import { useEffect, useState } from 'react'
import { Settings, Download } from 'lucide-react'
import api from '../services/api'
import TranscriptPanel from '../components/transcript/TranscriptPanel'
import SuggestionsPanel from '../components/suggestions/SuggestionsPanel'
import ChatPanel from '../components/chat/ChatPanel'
import SettingsModal from '../components/settings/SettingsModal'
import { useMic } from '../hooks/useMic'
import { useSuggestions } from '../hooks/useSuggestions'
import { useTranscriptStore } from '../store/transcriptStore'
import { useSuggestionsStore } from '../store/suggestionsStore'
import { useChatStore } from '../store/chatStore'

export default function Landing() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isRecording, error, startMic, stopMic } = useMic()
  const { fetchSuggestions } = useSuggestions()
  const transcriptChunks = useTranscriptStore((s) => s.chunks)
  const suggestionBatches = useSuggestionsStore((s) => s.batches)
  const chatMessages = useChatStore((s) => s.messages)

  useEffect(() => {
    api.get('/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('error'))
  }, [])

  function handleCardClick(card: { type: string; title: string; preview: string }) {
    setPendingMessage(`${card.title}: ${card.preview}`)
  }

  function handleExport() {
    const session = {
      exportedAt: new Date().toISOString(),
      transcript: transcriptChunks,
      suggestionBatches: suggestionBatches,
      chat: chatMessages,
    }
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revelio-session-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 shrink-0">
        <span className="text-lg font-bold tracking-wide">Revelio</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm text-white transition-all"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm text-white transition-all"
          >
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Column - Transcript */}
        <div className="flex flex-col w-1/3 border-r border-gray-800 p-4 overflow-hidden">
          <TranscriptPanel
            isRecording={isRecording}
            error={error}
            startMic={startMic}
            stopMic={stopMic}
          />
        </div>

        {/* Middle Column - Suggestions */}
        <div className="flex flex-col w-1/3 border-r border-gray-800 p-4 overflow-hidden">
          <SuggestionsPanel
            isRecording={isRecording}
            onCardClick={handleCardClick}
            fetchSuggestions={fetchSuggestions}
          />
        </div>

        {/* Right Column - Chat */}
        <div className="flex flex-col w-1/3 p-4 overflow-hidden">
          <ChatPanel
            pendingMessage={pendingMessage}
            onPendingConsumed={() => setPendingMessage(null)}
          />
        </div>

      </div>

      {/* Backend status */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        Backend: {backendStatus}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>
  )
}