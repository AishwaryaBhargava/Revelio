import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'

function Label({ children }: { children: string }) {
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
      {children}
    </span>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '13px',
  color: 'var(--text-primary)',
  fontFamily: "'Outfit', sans-serif",
  outline: 'none',
  boxSizing: 'border-box' as const,
  appearance: 'none' as const,
  MozAppearance: 'textfield' as const,
}

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div>
        <Label>Groq API Key</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            placeholder="gsk_..."
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => setShowKey((prev) => !prev)}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '5px' }}>
          Get your key at console.groq.com
        </p>
      </div>

      <div>
        <Label>Suggestion Prompt</Label>
        <textarea
          value={suggestionPrompt}
          onChange={(e) => setSuggestionPrompt(e.target.value)}
          rows={6}
          style={{ ...inputStyle, resize: 'none' }}
        />
      </div>

      <div>
        <Label>Chat Prompt</Label>
        <textarea
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <Label>Context Window (words)</Label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-input)' }}>
            <input
              type="number"
              value={contextWindowWords}
              onChange={(e) => setContextWindowWords(Number(e.target.value))}
              style={{ ...inputStyle, border: 'none', flex: 1, borderRadius: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)' }}>
              <button
                onClick={() => setContextWindowWords(contextWindowWords + 50)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', borderBottom: '1px solid var(--border)', fontFamily: "'Outfit', sans-serif" }}
              >▲</button>
              <button
                onClick={() => setContextWindowWords(Math.max(50, contextWindowWords - 50))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', fontFamily: "'Outfit', sans-serif" }}
              >▼</button>
            </div>
          </div>
        </div>
        <div>
          <Label>Chat Max Tokens</Label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-input)' }}>
            <input
              type="number"
              value={chatMaxTokens}
              onChange={(e) => setChatMaxTokens(Number(e.target.value))}
              style={{ ...inputStyle, border: 'none', flex: 1, borderRadius: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)' }}>
              <button
                onClick={() => setChatMaxTokens(chatMaxTokens + 100)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', borderBottom: '1px solid var(--border)', fontFamily: "'Outfit', sans-serif" }}
              >▲</button>
              <button
                onClick={() => setChatMaxTokens(Math.max(100, chatMaxTokens - 100))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', fontFamily: "'Outfit', sans-serif" }}
              >▼</button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={resetToDefaults}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Outfit', sans-serif", textAlign: 'left', width: 'fit-content' }}
      >
        Reset to defaults
      </button>

    </div>
  )
}