import { render, screen } from '@testing-library/react'
import YouTube from './YouTube'
import { useYouTubeVideos } from '../hooks/useYouTubeVideos'

vi.mock('../hooks/useYouTubeVideos', () => ({
  useYouTubeVideos: vi.fn(),
}))

const mockVideo = {
  id: 'abc123',
  title: '테스트 영상',
  publishedAt: '2026-01-01T00:00:00Z',
}

describe('YouTube', () => {
  beforeEach(() => {
    vi.mocked(useYouTubeVideos).mockReturnValue({
      videos: [mockVideo],
      loading: false,
      error: null,
    })
  })

  it('renders subscribe button linking to YouTube', () => {
    render(<YouTube />)
    const link = screen.getByRole('link', { name: /구독하기/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', expect.stringContaining('youtube.com'))
  })

  it('renders video thumbnails from API', () => {
    render(<YouTube />)
    const thumbnails = screen.getAllByRole('img')
    expect(thumbnails.length).toBeGreaterThan(0)
    expect(thumbnails[0]).toHaveAttribute('alt', '테스트 영상')
  })

  it('shows loading state', () => {
    vi.mocked(useYouTubeVideos).mockReturnValue({ videos: [], loading: true, error: null })
    render(<YouTube />)
    expect(screen.getByText('영상을 불러오는 중...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useYouTubeVideos).mockReturnValue({
      videos: [],
      loading: false,
      error: '영상을 불러오지 못했습니다.',
    })
    render(<YouTube />)
    expect(screen.getByText('영상을 불러오지 못했습니다.')).toBeInTheDocument()
  })
})
