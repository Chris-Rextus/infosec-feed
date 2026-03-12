// frontend/src/features/feed/hooks/useFeed.ts

import { useState, useEffect, useCallback } from 'react'
import type { FeedItem, PlatformMeta } from '../../../shared/types'

interface UseFeedReturn {
  items:   FeedItem[]
  meta:    { youtube: PlatformMeta; x: PlatformMeta; telegram: PlatformMeta }
  loading: boolean
  error:   string | null
  refresh: () => void
}

export function useFeed(): UseFeedReturn {

    const [items, setItems]     = useState<FeedItem[]>([])
    const [meta, setMeta]       = useState({
        youtube:  { error: null, from_cache: null },
        x:        { error: null, from_cache: null },
        telegram: { error: null, from_cache: null },
    })
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    const fetchFeed = useCallback(async () => {
        
        setLoading(true)
        setError(null)
        
        try {
            const res  = await fetch('/api/feed?platform=all')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setItems(data.items ?? [])
            setMeta(data.meta)

        } catch (e) {
            setError('Could not reach the backend. Is it running on :8000?')

        } finally {
            setLoading(false)
        }
    
    }, [])

    useEffect(() => { fetchFeed() }, [fetchFeed])

    return { items, meta, loading, error, refresh: fetchFeed }
}