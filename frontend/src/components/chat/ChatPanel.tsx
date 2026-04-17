import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface PendingMessage {
  title: string
  cardContext?: string
}

interface Props {
  pendingMessage?: PendingMessage | null
  onPendingConsumed?: () => void
}

export default function ChatPanel({ pendingMessage, onPendingConsumed }: Props) {
  const { messages, isStreaming, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  useEffect(() => {
    if (pendingMessage) {
      sendMessage(pendingMessage.title, pendingMessage.cardContext)
      onPendingConsumed?.()
    }
  }, [pendingMessage])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Chat
        </span>
      </div>

      <div
        className="hide-scrollbar"
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {messages.length === 0 && !isStreaming ? (
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.6 }}>
            Click a suggestion or type a question below...
          </p>
        ) : (
          messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1
            const isEmptyAssistant = msg.role === 'assistant' && msg.content === ''
            if (isLastMessage && isEmptyAssistant) return null
            return <ChatMessage key={index} message={msg} />
          })
        )}

        {isStreaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px 12px 12px 3px',
              alignItems: 'center',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)', animation: 'bounce 1s infinite' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)', animation: 'bounce 1s infinite 0.15s' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)', animation: 'bounce 1s infinite 0.3s' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} isStreaming={isStreaming} />

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}