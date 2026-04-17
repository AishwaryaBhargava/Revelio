import { Mic, MicOff } from 'lucide-react'

interface Props {
  isRecording: boolean
  onClick: () => void
}

export default function MicButton({ isRecording, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '10px',
        border: isRecording
          ? '1px solid rgba(110,187,168,0.4)'
          : '1px solid var(--border-light)',
        background: isRecording
          ? 'rgba(110,187,168,0.12)'
          : 'var(--bg-card)',
        color: isRecording ? 'var(--primary-mid)' : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        width: 'fit-content',
      }}
    >
      {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  )
}