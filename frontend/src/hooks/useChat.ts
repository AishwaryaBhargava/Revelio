import { useCallback } from 'react'
import api from '../services/api'
import { useChatStore } from '../store/chatStore'
import { useTranscriptStore } from '../store/transcriptStore'

export function useChat() {
  const { messages, isStreaming, addMessage, appendToLast, setStreaming } = useChatStore()

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return

    const transcript = useTranscriptStore.getState().chunks.map((c) => c.text).join(' ')
    const history = useChatStore.getState().messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    addMessage('user', content)
    addMessage('assistant', '')
    setStreaming(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          transcript,
          history,
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const token = decoder.decode(value, { stream: true })
        appendToLast(token)
      }
    } catch (err) {
      console.error('Chat error:', err)
      appendToLast('Sorry, something went wrong. Please try again.')
    } finally {
      setStreaming(false)
    }
  }, [isStreaming, addMessage, appendToLast, setStreaming])

  return { messages, isStreaming, sendMessage }
}