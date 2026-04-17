import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-900/90 border border-red-700 text-red-200 text-sm px-4 py-3 rounded-lg shadow-lg">
      <span>{message}</span>
      <button onClick={onClose} className="text-red-400 hover:text-red-200">
        <X size={14} />
      </button>
    </div>
  )
}