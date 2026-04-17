import ReactMarkdown from 'react-markdown'
import type { ChatMessage as ChatMessageType } from '../../store/chatStore'

interface Props {
  message: ChatMessageType
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: '4px' }}>
      <div
        style={{
          maxWidth: '88%',
          borderRadius: isUser ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
          padding: '10px 14px',
          background: isUser ? 'rgba(110,187,168,0.15)' : 'var(--bg-card)',
          border: isUser ? '1px solid rgba(110,187,168,0.25)' : '1px solid var(--border)',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'var(--text-primary)',
        }}
      >
        {isUser ? (
          <p style={{ margin: 0 }}>{message.content}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p style={{ margin: 0, lineHeight: 1.7 }}>{children}</p>,
                strong: ({ children }) => <strong style={{ fontWeight: 600, color: 'var(--primary-mid)' }}>{children}</strong>,
                ul: ({ children }) => <ul style={{ paddingLeft: '16px', margin: '4px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: '16px', margin: '4px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>{children}</ol>,
                li: ({ children }) => <li style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</li>,
                code: ({ children }) => <code style={{ background: 'var(--bg-input)', padding: '1px 5px', borderRadius: '4px', fontSize: '12px', color: 'var(--primary-mid)' }}>{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      <span style={{ fontSize: '10px', color: 'var(--text-dim)', padding: '0 4px' }}>
        {message.timestamp}
      </span>
    </div>
  )
}