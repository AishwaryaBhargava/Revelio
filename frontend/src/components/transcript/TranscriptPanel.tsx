import { useMic } from '../../hooks/useMic'
import MicButton from './MicButton'
import TranscriptFeed from './TranscriptFeed'

export default function TranscriptPanel() {
  const { isRecording, error, startMic, stopMic } = useMic()

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-semibold text-gray-400 tracking-widest mb-4">
        1. MIC & TRANSCRIPT
      </div>

      <div className="mb-4">
        <MicButton
          isRecording={isRecording}
          onClick={isRecording ? stopMic : startMic}
        />
      </div>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <TranscriptFeed />
    </div>
  )
}