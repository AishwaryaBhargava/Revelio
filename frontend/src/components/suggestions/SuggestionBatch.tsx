import type { SuggestionBatch as SuggestionBatchType, SuggestionCard as SuggestionCardType } from '../../store/suggestionsStore'
import SuggestionCard from './SuggestionCard'

interface Props {
  batch: SuggestionBatchType
  isLatest: boolean
  onCardClick: (card: SuggestionCardType) => void
}

export default function SuggestionBatch({ batch, isLatest, onCardClick }: Props) {
  return (
    <div className={`space-y-2 ${!isLatest ? 'opacity-40' : ''}`}>
      <div className="text-xs text-gray-600 mb-1">{batch.timestamp}</div>
      {batch.cards.map((card, index) => (
        <SuggestionCard key={index} card={card} onClick={onCardClick} />
      ))}
    </div>
  )
}