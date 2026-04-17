import { Mic, Lightbulb, MessageSquare } from 'lucide-react'

export type TabType = 'transcript' | 'suggestions' | 'chat'

interface Props {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  isRecording: boolean
  hasNewSuggestions: boolean
  hasNewChat: boolean
}

export default function BottomNav({ activeTab, onTabChange, isRecording, hasNewSuggestions, hasNewChat }: Props) {
  const tabs = [
    {
      id: 'transcript' as TabType,
      label: 'Transcript',
      icon: Mic,
      badge: isRecording,
      badgeColor: '#ef4444',
    },
    {
      id: 'suggestions' as TabType,
      label: 'Suggestions',
      icon: Lightbulb,
      badge: hasNewSuggestions,
      badgeColor: 'var(--primary-accent)',
    },
    {
      id: 'chat' as TabType,
      label: 'Chat',
      icon: MessageSquare,
      badge: hasNewChat,
      badgeColor: 'var(--primary-mid)',
    },
  ]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-panel)',
      padding: '8px 0 12px 0',
      flexShrink: 0,
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 20px',
              position: 'relative',
              minWidth: '44px',
              minHeight: '44px',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={20}
                style={{ color: isActive ? 'var(--primary-mid)' : 'var(--text-dim)' }}
              />
              {tab.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: tab.badgeColor,
                  border: '1px solid var(--bg-panel)',
                }} />
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--primary-mid)' : 'var(--text-dim)',
              letterSpacing: '0.03em',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}