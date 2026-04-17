import { useEffect } from 'react'
import { X } from 'lucide-react'
import SettingsForm from './SettingsForm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          margin: '0 16px',
        }}
        className="hide-scrollbar"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Settings</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <SettingsForm />

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'rgba(110,187,168,0.12)',
              color: 'var(--primary-mid)',
              fontSize: '13px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Save and Close
          </button>
        </div>
      </div>
    </div>
  )
}