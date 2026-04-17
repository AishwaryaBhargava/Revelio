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
import { useSettingsStore } from '../store/settingsStore'
import revelioLogo from '../assets/revelio-logo.svg'
import ErrorModal from '../components/ErrorModal'

export default function Landing() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isRecording, error, startMic, stopMic } = useMic()
  const { fetchSuggestions } = useSuggestions()
  const transcriptChunks = useTranscriptStore((s) => s.chunks)
  const suggestionBatches = useSuggestionsStore((s) => s.batches)
  const chatMessages = useChatStore((s) => s.messages)
  const groqApiKey = useSettingsStore((s) => s.groqApiKey)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    api.get('/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('error'))
  }, [])

  useEffect(() => {
    function handleAuthError(e: Event) {
      const detail = (e as CustomEvent).detail
      setErrorMessage(detail)
      stopMic()
    }
    window.addEventListener('revelio:auth-error', handleAuthError)
    return () => window.removeEventListener('revelio:auth-error', handleAuthError)
  }, [stopMic])

  function handleCardClick(card: { type: string; title: string; preview: string }) {
    setPendingMessage(`${card.title}: ${card.preview}`)
  }

  function handleExport() {
    const session = {
      exportedAt: new Date().toISOString(),
      transcript: transcriptChunks,
      suggestionBatches,
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-base)', color: 'var(--text-primary)', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: '56px', borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={revelioLogo} alt="Revelio logo" style={{ width: '32px', height: '32px' }} />
          <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--primary)' }}>Revelio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', fontWeight: 500 }}>
            <Download size={13} />
            Export
          </button>
          <button onClick={() => setSettingsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', fontWeight: 500 }}>
            <Settings size={13} />
            Settings
          </button>
        </div>
      </div>

      {/* API Key Warning */}
      {!groqApiKey && (
        <div style={{
          background: 'rgba(142,212,196,0.1)',
          borderBottom: '1px solid rgba(142,212,196,0.3)',
          padding: '10px 28px',
          fontSize: '12px',
          color: '#e8fcf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8ed4c4', flexShrink: 0 }} />
            <span>No Groq API key set. Add your key in Settings before recording.</span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(110,187,168,0.15)',
              border: '1px solid rgba(110,187,168,0.3)',
              borderRadius: '6px',
              color: '#e8fcf5',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              padding: '4px 10px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Open Settings
          </button>
        </div>
      )}

      {/* 3-column layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Left - Transcript */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '33.333%', borderRight: '1px solid var(--border)', padding: '20px', overflow: 'hidden' }}>
          <TranscriptPanel isRecording={isRecording} error={error} startMic={startMic} stopMic={stopMic} />
        </div>

        {/* Middle - Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '33.333%', borderRight: '1px solid var(--border)', padding: '20px', overflow: 'hidden', background: 'var(--bg-panel)' }}>
          <SuggestionsPanel isRecording={isRecording} onCardClick={handleCardClick} fetchSuggestions={fetchSuggestions} />
        </div>

        {/* Right - Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '33.333%', padding: '20px', overflow: 'hidden' }}>
          <ChatPanel pendingMessage={pendingMessage} onPendingConsumed={() => setPendingMessage(null)} />
        </div>

      </div>

      {/* Backend status */}
      <div style={{ position: 'fixed', bottom: '12px', right: '16px', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.03em' }}>
        {backendStatus === 'connected' ? '● connected' : '○ disconnected'}
      </div>

      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}