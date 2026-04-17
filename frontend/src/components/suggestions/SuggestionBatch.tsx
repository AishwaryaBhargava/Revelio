import type { SuggestionBatch as SuggestionBatchType, SuggestionCard as SuggestionCardType } from '../../store/suggestionsStore'
import SuggestionCard from './SuggestionCard'

interface Props {
  batch: SuggestionBatchType
  isLatest: boolean
  onCardClick: (card: SuggestionCardType) => void
}

export default function SuggestionBatch({ batch, isLatest, onCardClick }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isLatest ? 1 : 0.4, transition: 'opacity 0.2s ease' }}>
      <span style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
        {batch.timestamp}
      </span>
      {batch.cards.map((card, index) => (
        <SuggestionCard key={index} card={card} onClick={onCardClick} />
      ))}
    </div>
  )
}