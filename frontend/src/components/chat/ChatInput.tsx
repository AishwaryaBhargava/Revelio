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
    <div className="flex items-center gap-2 border-t border-gray-800 pt-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={isStreaming}
        className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isStreaming || !input.trim()}
        className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-all"
      >
        <Send size={16} className="text-white" />
      </button>
    </div>
  )
}