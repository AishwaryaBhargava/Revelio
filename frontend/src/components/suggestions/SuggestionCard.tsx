import type { SuggestionCard as SuggestionCardType } from '../../store/suggestionsStore'

const TYPE_STYLES: Record<string, string> = {
  'QUESTION TO ASK': 'text-blue-400 border-blue-400',
  'TALKING POINT': 'text-purple-400 border-purple-400',
  'ANSWER': 'text-green-400 border-green-400',
  'FACT CHECK': 'text-yellow-400 border-yellow-400',
  'CLARIFICATION': 'text-orange-400 border-orange-400',
}

interface Props {
  card: SuggestionCardType
  onClick: (card: SuggestionCardType) => void
}

export default function SuggestionCard({ card, onClick }: Props) {
  const typeStyle = TYPE_STYLES[card.type] || 'text-gray-400 border-gray-400'

  return (
    <div
      onClick={() => onClick(card)}
      className="cursor-pointer border border-gray-700 hover:border-gray-500 rounded-lg p-3 bg-gray-900 hover:bg-gray-800 transition-all"
    >
      <div className={`text-xs font-semibold border rounded px-2 py-0.5 inline-block mb-2 ${typeStyle}`}>
        {card.type}
      </div>
      <div className="text-sm font-medium text-white mb-1">{card.title}</div>
      <div className="text-xs text-gray-400 leading-relaxed">{card.preview}</div>
    </div>
  )
}