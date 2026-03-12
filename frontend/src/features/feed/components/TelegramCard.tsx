// frontend/src/features/feed/components/TelegramCard.tsx

import type { FeedItem } from "../../../shared/types"

interface Props {
    item: FeedItem
    index: number
}

function fmtDate(iso: string): string {

    try {
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

    } catch {
        return iso;
    }
}


// Parse text and turn URLs into clickable links
function parseLinks(text: string): React.ReactNode[] {

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          onClick={async e => {
            e.stopPropagation()
            e.preventDefault()
            await fetch(`/api/open?url=${encodeURIComponent(part)}`)
          }}
          className="underline transition-colors duration-150"
          style={{ color: '#29b6f6' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-green)')}
          onMouseLeave={e => (e.currentTarget.style.color = '#29b6f6')}
        >
          {part}
        </a>
      )
    }

    return <span key={i}>{part}</span>
  })
}


async function openItem(url: string) {
  await fetch(`/api/open?url=${encodeURIComponent(url)}`)
}


export default function TelegramCard({item, index}: Props) {

    const delay = Math.min(index * 30, 500)

    return (
        <div
            onClick={() => openItem(item.url)}
            className="group flex flex-col cursor-pointer"
            style={{
                background: 'var(--bg)',
                borderBottom: '1px solid var(--border)',
                animation: 'fadeIn 0.25s ease both',
                animationDelay: `${delay}ms`,
            }}
        >
            {/* platform accent bar */}
            <div className="h-[2px] w-full" style={{ background: '#29b6f6' }} />

            <div className="flex flex-col gap-2 p-3">

                {/* meta row */}
                <div className="flex items-center gap-2 min-w-0">
                {item.avatar ? (
                    <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                    style={{ border: '1px solid var(--border)' }}
                    />
                ) : (
                    <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px]"
                    style={{
                        background: 'rgba(41,182,246,0.15)',
                        border: '1px solid rgba(41,182,246,0.3)',
                        color: '#29b6f6',
                    }}
                    >
                    ✈
                    </div>
                )}
                <span
                    className="text-[10px] uppercase tracking-widest px-1.5 py-px rounded-sm flex-shrink-0"
                    style={{ background: 'rgba(41,182,246,0.12)', color: '#29b6f6' }}
                >
                    TG
                </span>
                <span
                    className="text-[11px] uppercase tracking-wide truncate"
                    style={{ color: 'var(--muted)' }}
                >
                    {item.author}
                </span>
                </div>

                {/* message text with clickable links */}
                <p
                className="text-xs leading-relaxed break-words"
                style={{
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
                >
                {parseLinks(item.description || item.title)}
                </p>

                {/* date */}
                <p
                className="text-[10px] mt-1 pt-2"
                style={{
                    color: 'var(--muted)',
                    borderTop: '1px solid var(--border)',
                }}
                >
                {fmtDate(item.published)}
                </p>

            </div>
        </div>
    )
}