import { useCallback } from 'react'
import api from '../services/api'
import { useSuggestionsStore } from '../store/suggestionsStore'
import { useTranscriptStore } from '../store/transcriptStore'

export function useSuggestions() {
  const addBatch = useSuggestionsStore((s) => s.addBatch)
  const setLoading = useSuggestionsStore((s) => s.setLoading)

  const fetchSuggestions = useCallback(async () => {
    const chunks = useTranscriptStore.getState().chunks
    const transcript = chunks.map((c) => c.text).join(' ')
    setLoading(true)
    try {
      const response = await api.post('/suggestions', {
        transcript,
        context_window_words: 400,
      })
      addBatch(response.data.cards)
    } catch (err) {
      console.error('Suggestions error:', err)
    } finally {
      setLoading(false)
    }
  }, [addBatch, setLoading])

  return { fetchSuggestions }
}