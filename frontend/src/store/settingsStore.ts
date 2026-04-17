import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SUGGESTION_PROMPT = `You are a real-time meeting intelligence assistant. You are silently listening to a live conversation and your job is to surface exactly 3 suggestions that would be most useful to the listener RIGHT NOW.

Analyze the transcript carefully and generate exactly 3 suggestions. Each suggestion must be one of these types based on what is most useful given the current context:

- QUESTION TO ASK: A specific, insightful question the listener could ask right now
- TALKING POINT: A relevant point, fact, or perspective worth raising
- ANSWER: A direct answer to a question just asked in the conversation
- FACT CHECK: A claim made that should be verified, with the correct information
- CLARIFICATION: Something said that needs clarification, with the clearer explanation

Rules:
- Choose the types that make the most sense for what is happening RIGHT NOW
- Do not always return the same 3 types
- Each preview must be useful and informative on its own without needing to click
- Be specific to what was actually said, not generic
- Respond ONLY with valid JSON, no explanation, no markdown`

const DEFAULT_CHAT_PROMPT = `You are a real-time meeting intelligence assistant with access to the full conversation transcript. Be concise and direct. 3-5 sentences maximum unless a list is genuinely needed. Reference specific things from the transcript where relevant. Use simple markdown only: bold for key terms, bullet points if listing 3+ items. Never use tables. Lead with the answer, not the context.`

interface SettingsStore {
  groqApiKey: string
  suggestionPrompt: string
  chatPrompt: string
  contextWindowWords: number
  chatMaxTokens: number
  setGroqApiKey: (key: string) => void
  setSuggestionPrompt: (prompt: string) => void
  setChatPrompt: (prompt: string) => void
  setContextWindowWords: (words: number) => void
  setChatMaxTokens: (tokens: number) => void
  resetToDefaults: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      groqApiKey: '',
      suggestionPrompt: DEFAULT_SUGGESTION_PROMPT,
      chatPrompt: DEFAULT_CHAT_PROMPT,
      contextWindowWords: 400,
      chatMaxTokens: 1000,
      setGroqApiKey: (key) => {
        set({ groqApiKey: key })
        localStorage.setItem('groq_api_key', key)
      },
      setSuggestionPrompt: (prompt) => set({ suggestionPrompt: prompt }),
      setChatPrompt: (prompt) => set({ chatPrompt: prompt }),
      setContextWindowWords: (words) => set({ contextWindowWords: words }),
      setChatMaxTokens: (tokens) => set({ chatMaxTokens: tokens }),
      resetToDefaults: () => set({
        suggestionPrompt: DEFAULT_SUGGESTION_PROMPT,
        chatPrompt: DEFAULT_CHAT_PROMPT,
        contextWindowWords: 400,
        chatMaxTokens: 1000,
      }),
    }),
    { name: 'revelio-settings' }
  )
)