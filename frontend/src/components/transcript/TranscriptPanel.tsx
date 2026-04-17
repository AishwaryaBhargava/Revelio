import MicButton from './MicButton'
import TranscriptFeed from './TranscriptFeed'

interface Props {
  isRecording: boolean
  error: string | null
  startMic: () => void
  stopMic: () => void
}

export default function TranscriptPanel({ isRecording, error, startMic, stopMic }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Transcript
        </span>
        {isRecording && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--primary-accent)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)', animation: 'pulse 1.5s infinite' }} />
            Live
          </span>
        )}
      </div>

      <MicButton isRecording={isRecording} onClick={isRecording ? stopMic : startMic} />

      {error && (
        <div style={{ fontSize: '12px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
          {error}
        </div>
      )}

      <TranscriptFeed />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}