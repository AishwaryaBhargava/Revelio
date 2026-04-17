import type { SuggestionCard as SuggestionCardType } from '../../store/suggestionsStore'

const TYPE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  'QUESTION TO ASK': {
    color: '#6fbba8',
    bg: 'rgba(110,187,168,0.08)',
    border: 'rgba(110,187,168,0.25)',
  },
  'TALKING POINT': {
    color: '#8ed4c4',
    bg: 'rgba(142,212,196,0.08)',
    border: 'rgba(142,212,196,0.25)',
  },
  'ANSWER': {
    color: '#a8d8a8',
    bg: 'rgba(168,216,168,0.08)',
    border: 'rgba(168,216,168,0.25)',
  },
  'FACT CHECK': {
    color: '#d4b896',
    bg: 'rgba(212,184,150,0.08)',
    border: 'rgba(212,184,150,0.25)',
  },
  'CLARIFICATION': {
    color: '#b8a8d8',
    bg: 'rgba(184,168,216,0.08)',
    border: 'rgba(184,168,216,0.25)',
  },
}

const DEFAULT_STYLE = {
  color: 'var(--text-muted)',
  bg: 'var(--bg-card)',
  border: 'var(--border)',
}

interface Props {
  card: SuggestionCardType
  onClick: (card: SuggestionCardType) => void
}

export default function SuggestionCard({ card, onClick }: Props) {
  const style = TYPE_STYLES[card.type] || DEFAULT_STYLE

  return (
    <div
      onClick={() => onClick(card)}
      style={{
        cursor: 'pointer',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '14px',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = style.border
        ;(e.currentTarget as HTMLDivElement).style.background = style.bg
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-base)'
      }}
    >
      <span style={{
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: style.color,
        textTransform: 'uppercase',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '4px',
        padding: '2px 7px',
        width: 'fit-content',
      }}>
        {card.type}
      </span>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
        {card.title}
      </p>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
        {card.preview}
      </p>
    </div>
  )
}