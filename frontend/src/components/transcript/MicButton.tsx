import { Mic, MicOff } from 'lucide-react'

interface MicButtonProps {
  isRecording: boolean
  onClick: () => void
}

export default function MicButton({ isRecording, onClick }: MicButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isRecording
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`}
    >
      {isRecording ? (
        <>
          <MicOff size={16} />
          Stop Recording
        </>
      ) : (
        <>
          <Mic size={16} />
          Start Recording
        </>
      )}
    </button>
  )
}