// frontend/src/features/feed/index.tsx

import { useState, useMemo } from "react";
import { useFeed } from "./hooks/useFeed";
import { useStatus } from "../../shared/hooks/useStatus";
import VideoCard from "./components/VideoCard";
import TelegramCard from "./components/TelegramCard";
import Toolbar from "./components/Toolbar";
import type { FeedFilters } from "../../shared/types";

type RightPanel = 'telegram' | 'x'

// ── Status dot ────────────────────────────────────────────────────────────────

interface DotProps { ok: boolean, label: string };

function StatusDot({ ok, label }: DotProps) {

  return (
    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: ok ? 'var(--accent-green)' : '#ffaa00',
          boxShadow:  ok ? '0 0 6px var(--accent-green)' : '0 0 6px #ffaa00',
        }}
      />
      {label}
    </div>
  )
}


// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3">
      <span className="text-4xl opacity-20">📡</span>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>{message}</p>
    </div>
  );
};


// ── Loading state ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="col-span-full flex items-center justify-center py-24 gap-3">
      <span
        className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
        style={{
          borderColor: 'var(--border)',
          borderTopColor: 'var(--accent-green)',
        }}
      />
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Fetching feed...</p>
    </div>
  );
};


// ── Panel toggle button ───────────────────────────────────────────────────────

interface PanelBtnProps {
  active:   boolean
  onClick:  () => void
  color:    string
  children: React.ReactNode
}

function PanelBtn({ active, onClick, color, children }: PanelBtnProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest transition-all duration-150"
      style={{
        fontFamily:  'JetBrains Mono, monospace',
        border:      `1px solid ${active ? color : 'var(--border)'}`,
        background:  active ? `${color}18` : 'transparent',
        color:       active ? color : 'var(--muted)',
        cursor:      'pointer',
      }}
    >
      {children}
    </button>
  )
}


// ── Feed screen ───────────────────────────────────────────────────────────────

export default function FeedScreen() {

  const { items, loading, error, refresh } = useFeed()
  const status = useStatus()

  const [filters, setFilters]       = useState<FeedFilters>({ search: '', sort: 'date_desc' })
  const [rightPanel, setRightPanel] = useState<RightPanel>('telegram')

  const filtered = useMemo(() => {
    let list = [...items]
    const q  = filters.search.toLowerCase().trim()

    if (q) {
      list = list.filter(i =>
        [i.title, i.author, i.description].join(' ').toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (filters.sort === 'date_desc') return b.published > a.published ? 1 : -1
      if (filters.sort === 'date_asc')  return a.published > b.published ? 1 : -1
      if (filters.sort === 'author')    return a.author.localeCompare(b.author)
      return 0
    })

    return list
  }, [items, filters])

  const ytItems = filtered.filter(i => i.platform === 'youtube')
  const xItems  = filtered.filter(i => i.platform === 'x')
  const tgItems = filtered.filter(i => i.platform === 'telegram')

  const counts = {
    total:    filtered.length,
    youtube:  ytItems.length,
    x:        xItems.length,
    telegram: tgItems.length,
  }

  const ytOk = status?.youtube.authenticated ?? false
  const xOk  = (status?.x.handle_count ?? 0) > 0

  return (
    <div className="h-screen overflow-hidden flex flex-col">

      {/* ── HEADER ── */}
      <header
        className="h-14 px-6 flex items-center justify-between sticky top-0 z-50"
        style={{
          background:     'rgba(10,10,12,0.95)',
          borderBottom:   '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="text-base font-extrabold uppercase tracking-[0.15em]"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent-green)' }}
        >
          ASYMMETRICAL{' '}
          <span style={{ color: 'var(--muted)', fontWeight: 400 }}>// infosec</span>
        </div>

        <div className="flex items-center gap-5">
          <StatusDot ok={ytOk} label={ytOk ? 'YT ✓' : 'YT auth needed'} />
          <StatusDot ok={xOk}  label={xOk  ? `X (${status?.x.handle_count})` : 'X no handles'} />
        </div>
      </header>

      {/* ── TOOLBAR ── */}
      <Toolbar
        filters={filters}
        onChange={p => setFilters(f => ({ ...f, ...p }))}
        onRefresh={refresh}
        loading={loading}
        counts={counts}
      />

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT 50%: YouTube ── */}
        <div
          className="w-1/2 flex flex-col"
          style={{ borderRight: '1px solid var(--border)' }}
        >
          <div
            className="px-5 py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest flex-shrink-0"
            style={{
              background:   'var(--bg2)',
              borderBottom: '1px solid var(--border)',
              color:        'var(--accent-yt)',
            }}
          >
            <span>▶</span>
            <span>YouTube Subscriptions</span>
            <span style={{ color: 'var(--muted)' }}>— {counts.youtube} videos</span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap:        '1px',
                background: 'var(--border)',
              }}
            >
              {error              && <EmptyState message={error} />}
              {loading && !error  && <LoadingState />}
              {!loading && !error && ytItems.length === 0 && <EmptyState message="No videos found." />}
              {!loading && !error && ytItems.map((item, idx) => (
                <VideoCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT 50%: toggled panel ── */}
        <div className="w-1/2 flex flex-col min-h-0">

          {/* panel header with toggle */}
          <div
            className="px-4 py-2 flex items-center gap-2 flex-shrink-0"
            style={{
              background:   'var(--bg2)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <PanelBtn
              active={rightPanel === 'telegram'}
              onClick={() => setRightPanel('telegram')}
              color="#29b6f6"
            >
              <span>✈</span> Telegram
              <span style={{ color: 'var(--muted)', marginLeft: 4 }}>
                {counts.telegram > 0 ? counts.telegram : ''}
              </span>
            </PanelBtn>

            <PanelBtn
              active={rightPanel === 'x'}
              onClick={() => setRightPanel('x')}
              color="var(--accent-x)"
            >
              <span>𝕏</span> Following
              {counts.x > 0 && (
                <span style={{ color: 'var(--muted)', marginLeft: 4 }}>{counts.x}</span>
              )}
            </PanelBtn>
          </div>

          {/* ── TELEGRAM panel ── */}
          {rightPanel === 'telegram' && (
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading && !error && (
                <div className="flex items-center justify-center py-16 gap-3">
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--border)', borderTopColor: '#29b6f6' }}
                  />
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Fetching Telegram...</p>
                </div>
              )}
              {!loading && tgItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 px-6">
                  <span className="text-3xl opacity-10">✈</span>
                  <p className="text-[11px] text-center leading-relaxed" style={{ color: 'var(--muted)' }}>
                    No messages yet. Make sure your bot token and channel IDs are set in{' '}
                    <code style={{ color: 'var(--accent-green)' }}>backend/.env</code>
                  </p>
                </div>
              )}
              {!loading && tgItems.map((item, idx) => (
                <TelegramCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          )}

          {/* ── X panel ── */}
          {rightPanel === 'x' && (
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center gap-3 px-6">
              <span className="text-3xl opacity-10">𝕏</span>
              <p className="text-[11px] text-center leading-relaxed" style={{ color: 'var(--muted)' }}>
                Drop <code style={{ color: 'var(--accent-green)' }}>following.js</code>
                {' '}into <code style={{ color: 'var(--accent-green)' }}>backend/data/</code>
                {' '}to enable the X feed
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}