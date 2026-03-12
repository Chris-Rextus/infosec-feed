// frontend/src/features/feed/components/VideoCard.tsx

import type { FeedItem } from "../../../shared/types";

interface Props {
    item: FeedItem
    index: number
};

function fmtDate(iso: string): string {

    try {
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return iso;
    }
}


async function openItem(url: string) {
    await fetch(`/api/open?url=${encodeURIComponent(url)}`);
}


export default function VideoCard({item, index}: Props) {
    
    const delay = Math.min(index * 30, 500);

    return (
        <div
            onClick={() => openItem(item.url)}
            className="group flex flex-col cursor-pointer overflow-hidden"
            style={{
                background: 'var(--bg)',
                borderBottom: '1px solid var(--border)',
                animation: 'fadeIn 0.25s ease both',
                animationDelay: `${delay}ms`,
            }}
        >

            {/* platform accent bar */}
            <div className="h-[2px] w-full" style={{ background: 'var(--accent-yt)' }} />

            {/* thumbnail */}
            {item.thumbnail && (
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-200 group-hover:scale-[1.02]"
                    style={{ filter: 'saturate(0.75) brightness(0.9)' }}
                />
                {/* green gradient overlay on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,255,136,0.08))',
                    }}
                />
                </div>
            )}

            {/* body */}
            <div className="flex flex-col gap-2 p-3 flex-1">

                {/* meta row: avatar + tag + channel name */}
                <div className="flex items-center gap-2 min-w-0">
                    {item.avatar && (
                        <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        style={{ border: '1px solid var(--border)' }}
                        />
                    )}
                    <span
                        className="text-[10px] uppercase tracking-widest px-1.5 py-px rounded-sm flex-shrink-0"
                        style={{ background: 'rgba(255,60,60,0.12)', color: 'var(--accent-yt)' }}
                    >
                        YT
                    </span>
                    <span
                        className="text-[11px] uppercase tracking-wide truncate"
                        style={{ color: 'var(--muted)' }}
                    >
                        {item.author}
                    </span>
                </div>

                {/* title */}
                <p
                className="text-sm font-bold leading-snug transition-colors duration-150 group-hover:text-[#00ff88]"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
                >
                    {item.title}
                </p>

                {/* description */}
                {item.description && (
                <p
                    className="text-[11px] leading-relaxed line-clamp-2"
                    style={{ color: 'var(--muted)' }}
                >
                    {item.description}
                </p>
                )}

                {/* date */}
                <p
                    className="text-[10px] mt-auto pt-2"
                    style={{
                        color: 'var(--muted)',
                        borderTop: '1px solid var(--border)',
                    }}
                    >
                    {fmtDate(item.published)}
                </p>
            </div>

        </div>
    );
}