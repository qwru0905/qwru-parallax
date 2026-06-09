import { useState, useEffect } from 'react'

export interface YouTubeVideo {
  id: string
  title: string
  publishedAt: string
}

interface UseYouTubeVideosResult {
  videos: YouTubeVideo[]
  loading: boolean
  error: string | null
}

export function useYouTubeVideos(channelId: string, maxResults = 6): UseYouTubeVideosResult {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다.')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error('channel fetch failed')
        return res.json()
      })
      .then((data) => {
        const uploadsId: string | undefined = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
        if (!uploadsId) throw new Error('uploads playlist not found')
        return fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`,
          { signal: controller.signal }
        )
      })
      .then((res) => {
        if (!res.ok) throw new Error('playlist fetch failed')
        return res.json()
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data) => {
        const mapped: YouTubeVideo[] = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
        }))
        setVideos(mapped)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError('영상을 불러오지 못했습니다.')
        setLoading(false)
      })

    return () => controller.abort()
  }, [channelId, maxResults])

  return { videos, loading, error }
}
