// frontend/src/shared/hooks/useFeed.ts

export interface FeedItem {
    platform: 'youtube' | 'x'
    id: string
    title: string
    author: string
    avatar: string
    thumbnail: string
    url: string
    published: string
    description: string
}

export interface PlatformMeta {
    error: string | null
    from_cache: boolean | null
}

export interface FeedResponse {
    items: FeedItem[]
    meta: {
        youtube: PlatformMeta
        x: PlatformMeta
    }
}

export interface StatusResponse {
    youtube: {
        authenticated: boolean
        has_client_secret: boolean
    }
    x: {
        has_following_file: boolean
        handle_count: number
    }
}