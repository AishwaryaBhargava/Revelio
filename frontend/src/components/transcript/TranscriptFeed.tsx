import { useEffect, useRef } from 'react'
import { useTranscriptStore } from '../../store/transcriptStore'

export default function TranscriptFeed() {
  const chunks = useTranscriptStore((s) => s.chunks)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chunks])

  return (
    <div className="flex-1 overflow-y-auto space-y-3">
      {chunks.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          The transcript will appear here once you start recording...
        </p>
      ) : (
        chunks.map((chunk, index) => (
          <div key={index} className="text-sm">
            <span className="text-gray-500 text-xs mr-2">{chunk.timestamp}</span>
            <span className="text-gray-200">{chunk.text}</span>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}