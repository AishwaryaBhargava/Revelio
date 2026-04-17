import { create } from 'zustand'

export type SuggestionCard = {
  type: string
  title: string
  preview: string
}

export type SuggestionBatch = {
  timestamp: string
  cards: SuggestionCard[]
}

interface SuggestionsStore {
  batches: SuggestionBatch[]
  isLoading: boolean
  lastRefreshedAt: Date | null
  addBatch: (cards: SuggestionCard[]) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useSuggestionsStore = create<SuggestionsStore>((set) => ({
  batches: [],
  isLoading: false,
  lastRefreshedAt: null,
  addBatch: (cards) =>
    set((state) => ({
      batches: [
        { timestamp: new Date().toLocaleTimeString(), cards },
        ...state.batches,
      ],
      lastRefreshedAt: new Date(),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clear: () => set({ batches: [], lastRefreshedAt: null }),
}))