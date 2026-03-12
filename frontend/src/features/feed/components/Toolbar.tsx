// frontend/src/features/feed/components/Toolbar.tsx

import type { FeedFilters, SortOption } from "../../../shared/types";

interface Props {
    filters: FeedFilters
    onChange: (partial: Partial<FeedFilters>) => void
    onRefresh: () => void
    loading: boolean
    counts: { total: number; youtube: number; x: number }
};

export default function Toolbar({ filters, onChange, onRefresh, loading, counts }: Props) {
    
    return (
        <div
            className="sticky top-14 z-40 flex flex-col gap-2 px-5 py-3"
            style={{
                background: 'var(--bg2)',
                borderBottom: '1px solid var(--border)',
            }}
        >

            {/* ── controls row ── */}
            <div className="flex items-center gap-3 flex-wrap">
                
                {/* search */}
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                    <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none select-none"
                        style={{ color: 'var(--muted)' }}
                    >
                        //
                    </span>
                    <input
                        type="search"
                        placeholder="search title, channel..."
                        value={filters.search}
                        onChange={e => onChange({ search: e.target.value })}
                        className="w-full text-xs pl-8 pr-3 py-1.5 rounded-sm outline-none transition-colors duration-150"
                        style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontFamily: 'JetBrains Mono, monospace',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
                        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                </div>

                {/* sort */}
                <select
                    value={filters.sort}
                    onChange={e => onChange({ sort: e.target.value as SortOption })}
                    className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-sm outline-none cursor-pointer transition-colors duration-150"
                    style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--muted)',
                        fontFamily: 'JetBrains Mono, monospace',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                    <option value="date_desc">Newest first</option>
                    <option value="date_asc">Oldest first</option>
                    <option value="author">By channel</option>
                </select>

                {/* refresh */}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="ml-auto text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-sm transition-all duration-150"
                    style={{
                        background: 'rgba(0,255,136,0.08)',
                        border: '1px solid rgba(0,255,136,0.3)',
                        color: 'var(--accent-green)',
                        fontFamily: 'JetBrains Mono, monospace',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                    }}
                    onMouseEnter={e => {
                        if (!loading) {
                        e.currentTarget.style.background = 'rgba(0,255,136,0.15)'
                        e.currentTarget.style.borderColor = 'var(--accent-green)'
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(0,255,136,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'
                    }}
                    >
                    {loading ? '↻ loading...' : '↻ refresh'}
                </button>
            </div>

            {/* ── count bar ── */}
            {counts.total > 0 && (
                <div className="flex gap-5 text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                    <span>
                        Total{' '}
                        <span style={{ color: 'var(--text)' }}>{counts.total}</span>
                    </span>
                    <span>
                        YouTube{' '}
                        <span style={{ color: 'var(--accent-yt)' }}>{counts.youtube}</span>
                    </span>
                    <span>
                        X{' '}
                        <span style={{ color: 'var(--accent-x)' }}>{counts.x}</span>
                    </span>
                </div>
            )}
        </div>
    );
};