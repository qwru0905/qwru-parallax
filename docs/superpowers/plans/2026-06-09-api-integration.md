# API Integration & Cloudflare Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GitHub REST API로 레포지토리를 동적 로드하고, YouTube Data API v3로 최신 영상을 동적 로드한 후, Cloudflare Pages에 자동 배포한다.

**Architecture:** `useGitHubRepos`와 `useYouTubeVideos` 커스텀 훅이 각각 API를 fetch하고 `{ data, loading, error }` 상태를 반환한다. Dev.tsx와 YouTube.tsx는 각 훅을 사용해 동적 데이터를 렌더링한다. YouTube API 키는 `VITE_YOUTUBE_API_KEY` 환경 변수로 관리한다.

**Tech Stack:** React 19, TypeScript, Vitest, @testing-library/react, Vite `import.meta.env`

---

## 파일 구조

```
신규:
  src/hooks/useGitHubRepos.ts
  src/hooks/useGitHubRepos.test.ts
  src/hooks/useYouTubeVideos.ts
  src/hooks/useYouTubeVideos.test.ts
  .env.example
  public/_redirects

수정:
  src/data/videos.ts         — channelId 추가, 정적 videos 배열 제거
  src/pages/Dev.tsx          — useGitHubRepos 훅 사용
  src/pages/Dev.test.tsx     — 훅 mock으로 테스트 교체
  src/pages/YouTube.tsx      — useYouTubeVideos 훅 사용
  src/pages/YouTube.test.tsx — 훅 mock으로 테스트 교체
  src/pages/Dev.module.css   — .statusMsg 클래스 추가
  src/pages/YouTube.module.css — .statusMsg 클래스 추가
```

---

### Task 1: 환경 변수 파일 설정

**Files:**
- Create: `.env.example`

- [ ] **Step 1: .gitignore에 `.env.local`이 포함됐는지 확인**

  `.gitignore` 파일에 `*.local` 줄이 있으면 `.env.local`은 이미 무시됨. 있으면 다음 단계로.

- [ ] **Step 2: `.env.example` 생성**

```
VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
```

- [ ] **Step 3: 커밋**

```bash
git add .env.example
git commit -m "chore: add env example file for YouTube API key"
```

---

### Task 2: useGitHubRepos 훅

**Files:**
- Create: `src/hooks/useGitHubRepos.ts`
- Create: `src/hooks/useGitHubRepos.test.ts`

- [ ] **Step 1: 테스트 파일 작성**

`src/hooks/useGitHubRepos.test.ts`:
```typescript
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
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/hooks/useGitHubRepos.test.ts
```

Expected: FAIL — `useGitHubRepos` not found

- [ ] **Step 3: 훅 구현**

`src/hooks/useGitHubRepos.ts`:
```typescript
import { useState, useEffect } from 'react'

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  topics: string[]
  updated_at: string
  fork: boolean
}

interface UseGitHubReposResult {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
}

export function useGitHubRepos(username: string): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.json()
      })
      .then((data: GitHubRepo[]) => {
        setRepos(data.filter((r) => !r.fork))
        setLoading(false)
      })
      .catch(() => {
        setError('레포지토리를 불러오지 못했습니다.')
        setLoading(false)
      })
  }, [username])

  return { repos, loading, error }
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/hooks/useGitHubRepos.test.ts
```

Expected: 3 tests PASS

- [ ] **Step 5: 커밋**

```bash
git add src/hooks/useGitHubRepos.ts src/hooks/useGitHubRepos.test.ts
git commit -m "feat: add useGitHubRepos hook"
```

---

### Task 3: Dev 페이지 GitHub API 연동

**Files:**
- Modify: `src/pages/Dev.tsx`
- Modify: `src/pages/Dev.test.tsx`
- Modify: `src/pages/Dev.module.css`

- [ ] **Step 1: `Dev.module.css`에 `.statusMsg` 추가**

파일 하단에 추가:
```css
.statusMsg {
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 0.5rem 0;
}
```

- [ ] **Step 2: `Dev.tsx` 전체 교체**

`src/pages/Dev.tsx`:
```tsx
import PageLayout from '../components/PageLayout'
import { skills } from '../data/projects'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import styles from './Dev.module.css'

export default function Dev() {
  const { repos, loading, error } = useGitHubRepos('qwru0905')

  return (
    <PageLayout>
      <div className={styles.page}>
        <p className={styles.label}>Developer</p>
        <h1 className={styles.name}>qwru0905</h1>
        <p className={styles.bio}>
          코드를 작성하고, 만드는 것을 즐깁니다.
        </p>
        <a
          href="https://github.com/qwru0905"
          target="_blank"
          rel="noreferrer"
          className={styles.githubLink}
          aria-label="GitHub"
        >
          GitHub →
        </a>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Skills</p>
          <div className={styles.skills}>
            {skills.map((skill) => (
              <span key={skill} className={styles.skill}>{skill}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Projects</p>
          {loading && <p className={styles.statusMsg}>레포지토리를 불러오는 중...</p>}
          {error && <p className={styles.statusMsg}>{error}</p>}
          <div className={styles.projects}>
            {repos.map((repo) => (
              <div key={repo.id} className={styles.projectCard}>
                <div>
                  <p className={styles.projectName}>{repo.name}</p>
                  <p className={styles.projectDesc}>{repo.description ?? ''}</p>
                  <div className={styles.projectTags}>
                    {repo.topics.map((topic) => (
                      <span key={topic} className={styles.tag}>{topic}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectLink}
                  aria-label={`${repo.name} repository`}
                >
                  GitHub →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
```

- [ ] **Step 3: `Dev.test.tsx` 전체 교체**

`src/pages/Dev.test.tsx`:
```tsx
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
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
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
```

- [ ] **Step 4: 전체 테스트 실행 — 통과 확인**

```bash
npx vitest run
```

Expected: 모든 테스트 PASS (기존 12개 + 신규 2개)

- [ ] **Step 5: 커밋**

```bash
git add src/pages/Dev.tsx src/pages/Dev.test.tsx src/pages/Dev.module.css
git commit -m "feat: wire Dev page to GitHub API via useGitHubRepos hook"
```

---

### Task 4: useYouTubeVideos 훅

**Files:**
- Modify: `src/data/videos.ts`
- Create: `src/hooks/useYouTubeVideos.ts`
- Create: `src/hooks/useYouTubeVideos.test.ts`

- [ ] **Step 1: `videos.ts` 업데이트 — channelId 추가, 정적 videos 배열 제거**

`src/data/videos.ts` 전체 교체:
```typescript
// ⚠️ 실제 채널 정보로 교체하세요
// channelId: YouTube Studio → 채널 → 고급 설정 → 채널 ID (UC로 시작하는 문자열)
export const channelId = 'YOUR_CHANNEL_ID'
export const channelUrl = 'https://www.youtube.com/@YOUR_CHANNEL_NAME'
export const channelName = '채널 이름을 입력하세요'
```

- [ ] **Step 2: 테스트 파일 작성**

`src/hooks/useYouTubeVideos.test.ts`:
```typescript
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
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/hooks/useYouTubeVideos.test.ts
```

Expected: FAIL — `useYouTubeVideos` not found

- [ ] **Step 4: 훅 구현**

`src/hooks/useYouTubeVideos.ts`:
```typescript
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
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다.')
      setLoading(false)
      return
    }

    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('channel fetch failed')
        return res.json()
      })
      .then((data) => {
        const uploadsId: string = data.items[0].contentDetails.relatedPlaylists.uploads
        return fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`
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
      .catch(() => {
        setError('영상을 불러오지 못했습니다.')
        setLoading(false)
      })
  }, [channelId, maxResults])

  return { videos, loading, error }
}
```

- [ ] **Step 5: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/hooks/useYouTubeVideos.test.ts
```

Expected: 3 tests PASS

- [ ] **Step 6: 커밋**

```bash
git add src/data/videos.ts src/hooks/useYouTubeVideos.ts src/hooks/useYouTubeVideos.test.ts
git commit -m "feat: add useYouTubeVideos hook and update videos data"
```

---

### Task 5: YouTube 페이지 YouTube API 연동

**Files:**
- Modify: `src/pages/YouTube.tsx`
- Modify: `src/pages/YouTube.test.tsx`
- Modify: `src/pages/YouTube.module.css`

- [ ] **Step 1: `YouTube.module.css`에 `.statusMsg` 추가**

파일 하단에 추가:
```css
.statusMsg {
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 0.5rem 0;
}
```

- [ ] **Step 2: `YouTube.tsx` 전체 교체**

`src/pages/YouTube.tsx`:
```tsx
import PageLayout from '../components/PageLayout'
import { channelUrl, channelName, channelId } from '../data/videos'
import { useYouTubeVideos } from '../hooks/useYouTubeVideos'
import styles from './YouTube.module.css'

export default function YouTube() {
  const { videos, loading, error } = useYouTubeVideos(channelId)

  return (
    <PageLayout>
      <div className={styles.page}>
        <p className={styles.label}>YouTube</p>

        <div className={styles.channelRow}>
          <div className={styles.channelIcon}>▶</div>
          <div>
            <p className={styles.channelName}>{channelName}</p>
            <p className={styles.channelDesc}>종합 게임 채널</p>
          </div>
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.subscribeBtn}
          >
            구독하기
          </a>
        </div>

        <p className={styles.sectionTitle}>최신 영상</p>
        {loading && <p className={styles.statusMsg}>영상을 불러오는 중...</p>}
        {error && <p className={styles.statusMsg}>{error}</p>}
        <div className={styles.grid}>
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noreferrer"
              className={styles.videoCard}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                className={styles.thumbnail}
              />
              <p className={styles.videoTitle}>{video.title}</p>
            </a>
          ))}
        </div>

        <a
          href={channelUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.moreLink}
        >
          YouTube에서 더보기 →
        </a>
      </div>
    </PageLayout>
  )
}
```

- [ ] **Step 3: `YouTube.test.tsx` 전체 교체**

`src/pages/YouTube.test.tsx`:
```tsx
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
```

- [ ] **Step 4: 전체 테스트 실행 — 통과 확인**

```bash
npx vitest run
```

Expected: 모든 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/pages/YouTube.tsx src/pages/YouTube.test.tsx src/pages/YouTube.module.css
git commit -m "feat: wire YouTube page to YouTube Data API via useYouTubeVideos hook"
```

---

### Task 6: Cloudflare Pages SPA 라우팅

**Files:**
- Create: `public/_redirects`

- [ ] **Step 1: `public/_redirects` 생성**

```
/* /index.html 200
```

이 파일이 없으면 `/dev`, `/youtube` 등을 직접 URL로 접근했을 때 Cloudflare가 404를 반환한다.

- [ ] **Step 2: 빌드 확인 — `dist/_redirects` 존재하는지 확인**

```bash
npm run build
```

`dist/_redirects` 파일이 생성됐으면 정상.

- [ ] **Step 3: 커밋**

```bash
git add public/_redirects
git commit -m "chore: add Cloudflare Pages SPA redirect rule"
```

---

## Cloudflare Pages 배포 설정 (수동 작업)

구현 완료 후 아래 순서로 진행:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
2. GitHub 계정 연결 → `qwru-parallax` 레포 선택
3. 빌드 설정:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `20`
4. **Environment variables** → Add variable:
   - `VITE_YOUTUBE_API_KEY` = (Google Cloud에서 발급한 실제 키)
   - Production + Preview 환경 모두 설정
5. Save and Deploy

> **YouTube API 키 도메인 제한:** 배포 후 Google Cloud Console → 사용자 인증 정보 → 해당 키 편집 → HTTP 리퍼러에 `*.pages.dev` 및 커스텀 도메인 추가

---

## 배포 후 확인

- [ ] `https://your-site.pages.dev/dev` — 레포지토리 목록 로드 확인
- [ ] `https://your-site.pages.dev/youtube` — 영상 그리드 로드 확인
- [ ] `/dev`, `/youtube`, `/music` 직접 URL 접근 시 404 없이 정상 렌더링 확인
