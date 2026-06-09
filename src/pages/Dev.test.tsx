import { render, screen } from '@testing-library/react'
import Dev from './Dev'
import { useGitHubRepos } from '../hooks/useGitHubRepos'

vi.mock('../hooks/useGitHubRepos', () => ({
  useGitHubRepos: vi.fn(),
}))

const mockRepo = {
  id: 1,
  name: 'test-repo',
  description: '테스트 레포',
  html_url: 'https://github.com/qwru0905/test-repo',
  topics: ['react', 'typescript'],
  updated_at: '2026-01-01T00:00:00Z',
  fork: false,
}

describe('Dev', () => {
  beforeEach(() => {
    vi.mocked(useGitHubRepos).mockReturnValue({
      repos: [mockRepo],
      loading: false,
      error: null,
    })
  })

  it('renders GitHub profile link', () => {
    render(<Dev />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/qwru0905'
    )
  })

  it('renders skills section', () => {
    render(<Dev />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders repo from GitHub API', () => {
    render(<Dev />)
    expect(screen.getByText('test-repo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /test-repo repository/i })).toHaveAttribute(
      'href',
      'https://github.com/qwru0905/test-repo'
    )
  })

  it('shows loading state', () => {
    vi.mocked(useGitHubRepos).mockReturnValue({ repos: [], loading: true, error: null })
    render(<Dev />)
    expect(screen.getByText('레포지토리를 불러오는 중...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useGitHubRepos).mockReturnValue({
      repos: [],
      loading: false,
      error: '레포지토리를 불러오지 못했습니다.',
    })
    render(<Dev />)
    expect(screen.getByText('레포지토리를 불러오지 못했습니다.')).toBeInTheDocument()
  })
})
