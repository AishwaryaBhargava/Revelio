import { create } from 'zustand'

interface TranscriptChunk {
  timestamp: string
  text: string
}

interface TranscriptStore {
  chunks: TranscriptChunk[]
  addChunk: (text: string) => void
  clear: () => void
}

export const useTranscriptStore = create<TranscriptStore>((set) => ({
  chunks: [],
  addChunk: (text) =>
    set((state) => ({
      chunks: [
        ...state.chunks,
        {
          timestamp: new Date().toLocaleTimeString(),
          text,
        },
      ],
    })),
  clear: () => set({ chunks: [] }),
}))