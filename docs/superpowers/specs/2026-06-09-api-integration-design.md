# API Integration & Cloudflare Deployment 설계 문서

**작성일:** 2026-06-09
**프로젝트:** qwru-parallax

---

## 개요

Dev 페이지의 정적 프로젝트 목록을 GitHub REST API로 동적 교체하고, YouTube 페이지의 정적 영상 목록을 YouTube Data API v3로 동적 교체한다. 완성된 사이트는 Cloudflare Pages에 GitHub 연동 자동 배포로 호스팅한다.

---

## 기술 스택 추가

| 항목 | 내용 |
|------|------|
| GitHub API | REST API v3 (인증 불필요) |
| YouTube API | Data API v3 (API 키 필요) |
| 환경 변수 | Vite `VITE_` prefix (클라이언트 노출 허용) |
| 호스팅 | Cloudflare Pages (GitHub 자동 배포) |

---

## 파일 구조

```
src/
├── hooks/
│   ├── useGitHubRepos.ts        (신규)
│   ├── useGitHubRepos.test.ts   (신규)
│   ├── useYouTubeVideos.ts      (신규)
│   └── useYouTubeVideos.test.ts (신규)
├── data/
│   └── videos.ts                (수정: channelId 추가)
├── pages/
│   ├── Dev.tsx                  (수정: hook 사용)
│   └── YouTube.tsx              (수정: hook 사용)
public/
└── _redirects                   (신규: SPA 라우팅)
.env.example                     (신규: 환경 변수 문서화)
.env.local                       (신규: gitignore, 실제 키 보관)
```

---

## 훅 설계

### `useGitHubRepos`

```typescript
interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  topics: string[]
  updated_at: string
}

interface UseGitHubReposResult {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
}
```

- **엔드포인트:** `https://api.github.com/users/qwru0905/repos?sort=updated&per_page=100`
- **인증:** 불필요 (공개 레포, 비인증 60req/h)
- **정렬:** 최근 업데이트 순

---

### `useYouTubeVideos`

```typescript
interface YouTubeVideo {
  id: string
  title: string
  publishedAt: string
}

interface UseYouTubeVideosResult {
  videos: YouTubeVideo[]
  loading: boolean
  error: string | null
}
```

**API 호출 흐름 (2단계):**

1. **채널 → 업로드 재생목록 ID 획득**
   ```
   GET https://www.googleapis.com/youtube/v3/channels
     ?part=contentDetails
     &id={channelId}
     &key={VITE_YOUTUBE_API_KEY}
   ```
   응답에서 `items[0].contentDetails.relatedPlaylists.uploads` 추출

2. **재생목록 → 최신 영상 6개 fetch**
   ```
   GET https://www.googleapis.com/youtube/v3/playlistItems
     ?part=snippet
     &playlistId={uploadsPlaylistId}
     &maxResults=6
     &key={VITE_YOUTUBE_API_KEY}
   ```

- **환경 변수:** `VITE_YOUTUBE_API_KEY`
- **채널 ID 저장:** `src/data/videos.ts`에 `channelId` 상수로 보관 (공개 정보, 비밀 아님)

---

## 로딩 / 에러 상태

| 상태 | Dev 페이지 | YouTube 페이지 |
|------|-----------|---------------|
| loading | "레포지토리를 불러오는 중..." 텍스트 | "영상을 불러오는 중..." 텍스트 |
| error | "불러오기 실패. 잠시 후 다시 시도해주세요." | "불러오기 실패. 잠시 후 다시 시도해주세요." |
| success | 레포 카드 목록 | 영상 그리드 |

---

## 환경 변수

### `.env.example` (커밋)
```
VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
```

### `.env.local` (gitignore, 로컬 개발용)
```
VITE_YOUTUBE_API_KEY=실제_키_값
```

### Cloudflare Pages 대시보드
- `VITE_YOUTUBE_API_KEY` — Production + Preview 환경 모두 설정

---

## YouTube API 키 발급 절차

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 (예: `qwru-parallax`)
3. **API 및 서비스 > 라이브러리** → "YouTube Data API v3" 검색 후 활성화
4. **API 및 서비스 > 사용자 인증 정보** → "사용자 인증 정보 만들기" → "API 키"
5. 생성된 키를 `.env.local`의 `VITE_YOUTUBE_API_KEY`에 입력
6. (선택) API 키 제한: HTTP 리퍼러를 Cloudflare Pages 도메인으로 제한 (보안 강화)

---

## Cloudflare Pages 배포 설정

| 항목 | 값 |
|------|---|
| 빌드 명령 | `npm run build` |
| 출력 디렉토리 | `dist` |
| Node.js 버전 | 20 |
| 환경 변수 | `VITE_YOUTUBE_API_KEY` |

**SPA 라우팅:** `public/_redirects` 파일로 처리
```
/* /index.html 200
```

**배포 흐름:** GitHub main 브랜치 push → Cloudflare Pages 자동 빌드 → 전 세계 CDN 배포

---

## 테스트 전략

- `useGitHubRepos.test.ts` — `fetch` mock으로 loading/success/error 상태 검증
- `useYouTubeVideos.test.ts` — 2단계 API 호출 mock, loading/success/error 검증
- `Dev.test.tsx` — 훅 mock으로 기존 렌더링 테스트 유지
- `YouTube.test.tsx` — 훅 mock으로 기존 렌더링 테스트 유지
