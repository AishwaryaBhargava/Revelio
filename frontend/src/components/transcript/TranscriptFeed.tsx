import { useEffect, useRef } from 'react'
import { useTranscriptStore } from '../../store/transcriptStore'

export default function TranscriptFeed() {
  const chunks = useTranscriptStore((s) => s.chunks)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chunks])

  return (
    <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {chunks.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.6 }}>
          Start recording and your transcript will appear here in real time...
        </p>
      ) : (
        chunks.map((chunk, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {chunk.timestamp}
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
              {chunk.text}
            </p>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}