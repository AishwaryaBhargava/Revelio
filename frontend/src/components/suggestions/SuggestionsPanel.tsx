import { RefreshCw } from 'lucide-react'
import { useSuggestionsStore } from '../../store/suggestionsStore'
import SuggestionBatch from './SuggestionBatch'

interface Props {
  isRecording: boolean
  onCardClick: (card: { type: string; title: string; preview: string }) => void
  fetchSuggestions: () => void
}

export default function SuggestionsPanel({ isRecording, onCardClick, fetchSuggestions }: Props) {
  const { batches, isLoading } = useSuggestionsStore()

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-semibold text-gray-400 tracking-widest mb-4">
        2. LIVE SUGGESTIONS
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm text-white disabled:opacity-50 transition-all"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Loading...' : 'Reload suggestions'}
        </button>

        {isRecording && (
          <span className="text-xs text-gray-500">
            auto-refresh on new transcript
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {batches.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Start recording to see live suggestions...
          </p>
        ) : (
          batches.map((batch, index) => (
            <SuggestionBatch
              key={index}
              batch={batch}
              isLatest={index === 0}
              onCardClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  )
}