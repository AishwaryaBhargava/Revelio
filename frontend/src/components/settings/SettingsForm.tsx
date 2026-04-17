import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'

export default function SettingsForm() {
  const [showKey, setShowKey] = useState(false)
  const {
    groqApiKey, setGroqApiKey,
    suggestionPrompt, setSuggestionPrompt,
    chatPrompt, setChatPrompt,
    contextWindowWords, setContextWindowWords,
    chatMaxTokens, setChatMaxTokens,
    resetToDefaults,
  } = useSettingsStore()

  return (
    <div className="space-y-6">

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          GROQ API KEY
        </label>
        <div className="flex items-center gap-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            placeholder="gsk_..."
            className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500"
          />
          <button
            onClick={() => setShowKey((prev) => !prev)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Get your key at console.groq.com
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          SUGGESTION PROMPT
        </label>
        <textarea
          value={suggestionPrompt}
          onChange={(e) => setSuggestionPrompt(e.target.value)}
          rows={6}
          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          CHAT PROMPT
        </label>
        <textarea
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
          rows={4}
          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            CONTEXT WINDOW (WORDS)
          </label>
          <input
            type="number"
            value={contextWindowWords}
            onChange={(e) => setContextWindowWords(Number(e.target.value))}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            CHAT MAX TOKENS
          </label>
          <input
            type="number"
            value={chatMaxTokens}
            onChange={(e) => setChatMaxTokens(Number(e.target.value))}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
          />
        </div>
      </div>

      <button
        onClick={resetToDefaults}
        className="text-xs text-gray-500 hover:text-gray-300 underline"
      >
        Reset to defaults
      </button>

    </div>
  )
}