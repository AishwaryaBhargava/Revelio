import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  isStreaming: boolean
}

export default function ChatInput({ onSend, isStreaming }: Props) {
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px', flexShrink: 0 }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={isStreaming}
        style={{
          flex: 1,
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '13px',
          color: 'var(--text-primary)',
          fontFamily: "'Outfit', sans-serif",
          outline: 'none',
          opacity: isStreaming ? 0.5 : 1,
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--border-light)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
      <button
        onClick={handleSend}
        disabled={isStreaming || !input.trim()}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
          background: input.trim() && !isStreaming ? 'rgba(110,187,168,0.15)' : 'transparent',
          color: input.trim() && !isStreaming ? 'var(--primary-accent)' : 'var(--text-dim)',
          cursor: input.trim() && !isStreaming ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        <Send size={14} />
      </button>
    </div>
  )
}