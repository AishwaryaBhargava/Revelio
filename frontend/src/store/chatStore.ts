import { create } from 'zustand'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
  timestamp: string
}

interface ChatStore {
  messages: ChatMessage[]
  isStreaming: boolean
  addMessage: (role: ChatRole, content: string) => void
  appendToLast: (token: string) => void
  setStreaming: (streaming: boolean) => void
  clear: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          role,
          content,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),
  appendToLast: (token) =>
    set((state) => {
      const messages = [...state.messages]
      if (messages.length === 0) return { messages }
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content: messages[messages.length - 1].content + token,
      }
      return { messages }
    }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  clear: () => set({ messages: [], isStreaming: false }),
}))