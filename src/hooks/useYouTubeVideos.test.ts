import { renderHook, waitFor } from '@testing-library/react'
import { useYouTubeVideos } from './useYouTubeVideos'

describe('useYouTubeVideos', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-api-key')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('fetches videos via two-step API call', async () => {
    const channelResponse = {
      items: [{ contentDetails: { relatedPlaylists: { uploads: 'UU_test_playlist' } } }],
    }
    const playlistResponse = {
      items: [
        {
          snippet: {
            resourceId: { videoId: 'vid1' },
            title: '테스트 영상',
            publishedAt: '2026-01-01T00:00:00Z',
          },
        },
      ],
    }

    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(channelResponse) } as unknown as Response)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(playlistResponse) } as unknown as Response)

    const { result } = renderHook(() => useYouTubeVideos('UC_test_channel_id'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.videos).toEqual([
      { id: 'vid1', title: '테스트 영상', publishedAt: '2026-01-01T00:00:00Z' },
    ])
    expect(result.current.error).toBeNull()
  })

  it('sets error when API key is missing', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('VITE_YOUTUBE_API_KEY', '')

    const { result } = renderHook(() => useYouTubeVideos('UC_test'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('YouTube API 키가 설정되지 않았습니다.')
    expect(result.current.videos).toEqual([])
  })

  it('sets error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as unknown as Response)

    const { result } = renderHook(() => useYouTubeVideos('UC_test'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('영상을 불러오지 못했습니다.')
    expect(result.current.videos).toEqual([])
  })
})
