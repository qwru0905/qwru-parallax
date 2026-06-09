import { renderHook, waitFor } from '@testing-library/react'
import { useGitHubRepos } from './useGitHubRepos'

describe('useGitHubRepos', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns repos on success', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'my-repo',
        description: '테스트 레포',
        html_url: 'https://github.com/user/my-repo',
        topics: ['react'],
        updated_at: '2026-01-01T00:00:00Z',
        fork: false,
      },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as unknown as Response)

    const { result } = renderHook(() => useGitHubRepos('testuser'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.repos).toEqual(mockRepos)
    expect(result.current.error).toBeNull()
  })

  it('filters out forked repos', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'my-repo',
        description: null,
        html_url: 'https://github.com/user/my-repo',
        topics: [],
        updated_at: '2026-01-01T00:00:00Z',
        fork: false,
      },
      {
        id: 2,
        name: 'forked-repo',
        description: null,
        html_url: 'https://github.com/user/forked-repo',
        topics: [],
        updated_at: '2026-01-01T00:00:00Z',
        fork: true,
      },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as unknown as Response)

    const { result } = renderHook(() => useGitHubRepos('testuser'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.repos).toHaveLength(1)
    expect(result.current.repos[0].name).toBe('my-repo')
  })

  it('sets error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as unknown as Response)

    const { result } = renderHook(() => useGitHubRepos('testuser'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('레포지토리를 불러오지 못했습니다.')
    expect(result.current.repos).toEqual([])
  })
})
