import ReactMarkdown from 'react-markdown'
import type { ChatMessage as ChatMessageType } from '../../store/chatStore'

interface Props {
  message: ChatMessageType
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-200'
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="space-y-1">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-200">{children}</li>,
                code: ({ children }) => <code className="bg-gray-700 px-1 rounded text-xs">{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  )
}