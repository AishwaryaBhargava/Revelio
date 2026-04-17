import { Settings, X } from 'lucide-react'

interface Props {
  message: string
  onClose: () => void
  onOpenSettings: () => void
}

export default function ErrorModal({ message, onClose, onOpenSettings }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '420px',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#ef4444', fontSize: '16px', fontWeight: 700 }}>!</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
              API Key Error
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {message}
        </p>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          Recording has been stopped. Add a valid Groq API key in Settings and start recording again.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
          <button
            onClick={() => { onClose(); onOpenSettings() }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(110,187,168,0.3)',
              background: 'rgba(110,187,168,0.12)',
              color: 'var(--primary-mid)',
              fontSize: '13px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Settings size={13} />
            Open Settings
          </button>
        </div>
      </div>
    </div>
  )
}