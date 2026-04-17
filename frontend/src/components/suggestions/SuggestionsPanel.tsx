import { RefreshCw } from 'lucide-react'
import { useSuggestionsStore } from '../../store/suggestionsStore'
import SuggestionBatch from './SuggestionBatch'

interface Props {
  isRecording: boolean
  onCardClick: (card: { type: string; title: string; preview: string }) => void
  fetchSuggestions: () => void
}

function SkeletonCard() {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ height: '10px', width: '80px', background: 'var(--border-light)', borderRadius: '4px' }} />
      <div style={{ height: '13px', width: '70%', background: 'var(--border)', borderRadius: '4px' }} />
      <div style={{ height: '11px', width: '100%', background: 'var(--border)', borderRadius: '4px', opacity: 0.6 }} />
      <div style={{ height: '11px', width: '85%', background: 'var(--border)', borderRadius: '4px', opacity: 0.4 }} />
    </div>
  )
}

export default function SuggestionsPanel({ isRecording, onCardClick, fetchSuggestions }: Props) {
  const { batches, isLoading } = useSuggestionsStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Live Suggestions
        </span>
        {isRecording && (
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            auto-refresh on new transcript
          </span>
        )}
      </div>

      <button
        onClick={fetchSuggestions}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          background: 'transparent',
          color: isLoading ? 'var(--text-dim)' : 'var(--text-secondary)',
          fontSize: '12px',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          width: 'fit-content',
          transition: 'all 0.2s ease',
        }}
      >
        <RefreshCw size={12} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        {isLoading ? 'Loading...' : 'Reload suggestions'}
      </button>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {isLoading && batches.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : batches.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.6 }}>
            Start recording to see live suggestions...
          </p>
        ) : (
          <>
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}
            {batches.map((batch, index) => (
              <SuggestionBatch
                key={index}
                batch={batch}
                isLatest={index === 0}
                onCardClick={onCardClick}
              />
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}