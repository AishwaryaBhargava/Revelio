import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface Props {
  pendingMessage?: string | null
  onPendingConsumed?: () => void
}

export default function ChatPanel({ pendingMessage, onPendingConsumed }: Props) {
  const { messages, isStreaming, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (pendingMessage) {
      sendMessage(pendingMessage)
      onPendingConsumed?.()
    }
  }, [pendingMessage])

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-semibold text-gray-400 tracking-widest mb-4">
        3. CHAT
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Click a suggestion or type a question below...
          </p>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
        {isStreaming && (
          <div className="text-xs text-gray-500 italic px-2 py-1">
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}