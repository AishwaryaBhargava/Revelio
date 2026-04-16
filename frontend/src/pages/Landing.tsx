import { useEffect, useState } from 'react'
import api from '../services/api'
import TranscriptPanel from '../components/transcript/TranscriptPanel'

export default function Landing() {
  const [backendStatus, setBackendStatus] = useState('checking...')

  useEffect(() => {
    api.get('/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('error'))
  }, [])

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden">

      {/* Left Column - Transcript */}
      <div className="flex flex-col w-1/3 border-r border-gray-800 p-4">
        <TranscriptPanel />
      </div>

      {/* Middle Column - Suggestions */}
      <div className="flex flex-col w-1/3 border-r border-gray-800 p-4">
        <div className="text-xs font-semibold text-gray-400 tracking-widest mb-4">
          2. LIVE SUGGESTIONS
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-gray-300">
          Suggestions will appear here...
        </div>
      </div>

      {/* Right Column - Chat */}
      <div className="flex flex-col w-1/3 p-4">
        <div className="text-xs font-semibold text-gray-400 tracking-widest mb-4">
          3. CHAT
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-gray-300">
          Chat will appear here...
        </div>
      </div>

      {/* Backend status indicator */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        Backend: {backendStatus}
      </div>

    </div>
  )
}