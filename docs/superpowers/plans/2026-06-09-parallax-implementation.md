# Parallax 개인 웹사이트 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** qwru0905의 개인 브랜드 허브 — Developer / YouTube / Music 세 영역을 분리된 페이지로 제공하는 웹사이트 구현

**Architecture:** React Router v6으로 4개 경로(/, /dev, /youtube, /music) 관리. Navbar와 PageLayout이 공통 레이아웃 담당. 페이지별 콘텐츠 데이터는 `src/data/`에서 분리 관리하여 UI와 데이터 수정을 독립적으로 할 수 있게 함.

**Tech Stack:** React 19, TypeScript, Vite, React Router v6, Vitest, @testing-library/react

---

## File Map

| 파일 | 액션 | 역할 |
|------|------|------|
| `package.json` | 수정 | react-router-dom, vitest, testing-library 추가 |
| `vite.config.ts` | 수정 | test 설정 추가 |
| `tsconfig.app.json` | 수정 | vitest/globals 타입 추가 |
| `src/test/setup.ts` | 생성 | @testing-library/jest-dom 임포트 |
| `src/index.css` | 수정 | CSS 변수 + 기본 리셋 (기존 Vite 기본값 교체) |
| `src/App.tsx` | 수정 | BrowserRouter + Routes 설정 |
| `src/App.css` | 삭제 | 더 이상 사용 안 함 |
| `src/components/Navbar.tsx` | 생성 | 로고(qwru0905) + 네비게이션 링크 |
| `src/components/Navbar.module.css` | 생성 | Navbar 스타일 |
| `src/components/Navbar.test.tsx` | 생성 | |
| `src/components/PageLayout.tsx` | 생성 | 공통 페이지 래퍼 (패딩, 최대 너비) |
| `src/components/PageLayout.module.css` | 생성 | |
| `src/components/PageLayout.test.tsx` | 생성 | |
| `src/data/projects.ts` | 생성 | 프로젝트 목록 + 기술 스택 데이터 |
| `src/data/videos.ts` | 생성 | YouTube 채널 정보 + 영상 데이터 |
| `src/pages/Home.tsx` | 생성 | 허브 페이지 (히어로 + 3개 포털 카드) |
| `src/pages/Home.module.css` | 생성 | |
| `src/pages/Home.test.tsx` | 생성 | |
| `src/pages/Dev.tsx` | 생성 | 개발자 페이지 |
| `src/pages/Dev.module.css` | 생성 | |
| `src/pages/Dev.test.tsx` | 생성 | |
| `src/pages/YouTube.tsx` | 생성 | YouTube 페이지 |
| `src/pages/YouTube.module.css` | 생성 | |
| `src/pages/YouTube.test.tsx` | 생성 | |
| `src/pages/Music.tsx` | 생성 | Coming Soon 페이지 |
| `src/pages/Music.module.css` | 생성 | |
| `src/pages/Music.test.tsx` | 생성 | |

---

### Task 1: 프로젝트 기반 설정

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Create: `src/test/setup.ts`
- Modify: `src/index.css`

- [ ] **Step 1: 초기 스캐폴드 커밋**

```bash
git add .
git commit -m "chore: initial Vite React TypeScript scaffold"
```

- [ ] **Step 2: 의존성 설치**

```bash
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: `node_modules/react-router-dom` 생성됨

- [ ] **Step 3: vite.config.ts에 테스트 설정 추가**

`vite.config.ts` 전체 교체:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 4: tsconfig.app.json에 vitest 타입 추가**

`tsconfig.app.json`의 `"types": ["vite/client"]` 를 아래로 교체:

```json
"types": ["vite/client", "vitest/globals"]
```

- [ ] **Step 5: 테스트 setup 파일 생성**

`src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: index.css를 CSS 변수 + 기본 리셋으로 전체 교체**

`src/index.css`:
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --accent-dev: #c084fc;
  --accent-dev-bg: rgba(130, 80, 255, 0.1);
  --accent-dev-border: rgba(130, 80, 255, 0.35);

  --accent-youtube: #f87171;
  --accent-youtube-bg: rgba(255, 80, 80, 0.1);
  --accent-youtube-border: rgba(255, 80, 80, 0.35);

  --accent-music: #60a5fa;
  --accent-music-bg: rgba(80, 180, 255, 0.1);
  --accent-music-border: rgba(80, 180, 255, 0.35);

  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.5);
  --text-muted: rgba(255, 255, 255, 0.3);

  --navbar-height: 56px;
}

body {
  background: linear-gradient(135deg, #0d0820, #0a1628, #001a2e);
  min-height: 100vh;
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

#root {
  min-height: 100vh;
}
```

- [ ] **Step 7: 테스트 실행 확인**

```bash
npx vitest run
```

Expected: "No test files found" 또는 0 tests (에러 없음)

- [ ] **Step 8: 커밋**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.app.json src/test/setup.ts src/index.css
git commit -m "chore: setup vitest, react-router-dom, global CSS variables"
```

---

### Task 2: PageLayout 컴포넌트

**Files:**
- Create: `src/components/PageLayout.tsx`
- Create: `src/components/PageLayout.module.css`
- Create: `src/components/PageLayout.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/components/PageLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import PageLayout from './PageLayout'

describe('PageLayout', () => {
  it('renders children', () => {
    render(<PageLayout><p>test content</p></PageLayout>)
    expect(screen.getByText('test content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/components/PageLayout.test.tsx
```

Expected: FAIL — "Cannot find module './PageLayout'"

- [ ] **Step 3: PageLayout 구현**

`src/components/PageLayout.module.css`:
```css
.layout {
  min-height: calc(100vh - var(--navbar-height));
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}
```

`src/components/PageLayout.tsx`:
```tsx
import { ReactNode } from 'react'
import styles from './PageLayout.module.css'

interface Props {
  children: ReactNode
}

export default function PageLayout({ children }: Props) {
  return <main className={styles.layout}>{children}</main>
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx vitest run src/components/PageLayout.test.tsx
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/PageLayout.tsx src/components/PageLayout.module.css src/components/PageLayout.test.tsx
git commit -m "feat: add PageLayout component"
```

---

### Task 3: Navbar 컴포넌트

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Navbar.module.css`
- Create: `src/components/Navbar.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/components/Navbar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('qwru0905')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DEV' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YOUTUBE' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'MUSIC' })).toBeInTheDocument()
  })

  it('logo links to home', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'qwru0905' })).toHaveAttribute('href', '/')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/components/Navbar.test.tsx
```

Expected: FAIL — "Cannot find module './Navbar'"

- [ ] **Step 3: Navbar 구현**

`src/components/Navbar.module.css`:
```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(13, 8, 32, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 100;
}

.logo {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.links {
  display: flex;
  gap: 24px;
}

.link {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.link:hover,
.active {
  color: var(--text-primary);
}
```

`src/components/Navbar.tsx`:
```tsx
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>qwru0905</Link>
      <div className={styles.links}>
        <Link
          to="/dev"
          className={`${styles.link} ${pathname === '/dev' ? styles.active : ''}`}
        >
          DEV
        </Link>
        <Link
          to="/youtube"
          className={`${styles.link} ${pathname === '/youtube' ? styles.active : ''}`}
        >
          YOUTUBE
        </Link>
        <Link
          to="/music"
          className={`${styles.link} ${pathname === '/music' ? styles.active : ''}`}
        >
          MUSIC
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx vitest run src/components/Navbar.test.tsx
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/Navbar.tsx src/components/Navbar.module.css src/components/Navbar.test.tsx
git commit -m "feat: add Navbar component"
```

---

### Task 4: Router 설정 (App.tsx)

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/App.css`

- [ ] **Step 1: 임시 페이지 파일 4개 생성 (빌드 오류 방지)**

`src/pages/Home.tsx`:
```tsx
export default function Home() { return <div>Home</div> }
```

`src/pages/Dev.tsx`:
```tsx
export default function Dev() { return <div>Dev</div> }
```

`src/pages/YouTube.tsx`:
```tsx
export default function YouTube() { return <div>YouTube</div> }
```

`src/pages/Music.tsx`:
```tsx
export default function Music() { return <div>Music</div> }
```

- [ ] **Step 2: App.tsx를 Router 설정으로 전체 교체**

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dev from './pages/Dev'
import YouTube from './pages/YouTube'
import Music from './pages/Music'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/music" element={<Music />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: App.css 삭제**

```bash
rm src/App.css
```

- [ ] **Step 4: 빌드 확인**

```bash
npx tsc -b && npx vite build
```

Expected: `dist/` 생성, 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/App.tsx src/pages/
git rm src/App.css
git commit -m "feat: setup React Router with placeholder pages"
```

---

### Task 5: Home 페이지

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/pages/Home.module.css`
- Create: `src/pages/Home.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/pages/Home.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('renders brand name', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'qwru0905' })).toBeInTheDocument()
  })

  it('renders three portal cards', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /developer/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /youtube/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /music/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/pages/Home.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Home 스타일 작성**

`src/pages/Home.module.css`:
```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--navbar-height) + 48px) 24px 48px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.title {
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 900;
  letter-spacing: -2px;
  color: var(--text-primary);
  line-height: 1;
}

.subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 10px;
  letter-spacing: 2px;
}

.cards {
  display: flex;
  gap: 16px;
  margin-top: 56px;
  width: 100%;
  max-width: 720px;
}

.card {
  flex: 1;
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.cardDev    { background: var(--accent-dev-bg);     border: 1px solid var(--accent-dev-border); }
.cardYoutube{ background: var(--accent-youtube-bg); border: 1px solid var(--accent-youtube-border); }
.cardMusic  { background: var(--accent-music-bg);   border: 1px solid var(--accent-music-border); }

.cardIcon { font-size: 28px; }

.cardTitle { font-size: 15px; font-weight: 700; }
.cardTitleDev     { color: var(--accent-dev); }
.cardTitleYoutube { color: var(--accent-youtube); }
.cardTitleMusic   { color: var(--accent-music); }

.cardDesc { font-size: 11px; color: var(--text-muted); }

.cardArrow { margin-top: 16px; font-size: 11px; }
.cardArrowDev     { color: var(--accent-dev-border); }
.cardArrowYoutube { color: var(--accent-youtube-border); }
.cardArrowMusic   { color: var(--accent-music-border); opacity: 0.5; }

@media (max-width: 600px) {
  .cards { flex-direction: column; }
}
```

- [ ] **Step 4: Home 컴포넌트 작성**

`src/pages/Home.tsx`:
```tsx
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>안녕하세요, 저는</p>
      <h1 className={styles.title}>qwru0905</h1>
      <p className={styles.subtitle}>개발자 · 유튜버 · 작곡가</p>

      <div className={styles.cards}>
        <Link to="/dev" className={`${styles.card} ${styles.cardDev}`} aria-label="developer">
          <span className={styles.cardIcon}>💻</span>
          <span className={`${styles.cardTitle} ${styles.cardTitleDev}`}>Developer</span>
          <span className={styles.cardDesc}>프로젝트 · 기술 스택</span>
          <span className={`${styles.cardArrow} ${styles.cardArrowDev}`}>→ 보러가기</span>
        </Link>

        <Link to="/youtube" className={`${styles.card} ${styles.cardYoutube}`} aria-label="youtube">
          <span className={styles.cardIcon}>🎬</span>
          <span className={`${styles.cardTitle} ${styles.cardTitleYoutube}`}>YouTube</span>
          <span className={styles.cardDesc}>게임 채널 · 최신 영상</span>
          <span className={`${styles.cardArrow} ${styles.cardArrowYoutube}`}>→ 보러가기</span>
        </Link>

        <Link to="/music" className={`${styles.card} ${styles.cardMusic}`} aria-label="music">
          <span className={styles.cardIcon}>🎵</span>
          <span className={`${styles.cardTitle} ${styles.cardTitleMusic}`}>Music</span>
          <span className={styles.cardDesc}>Coming Soon</span>
          <span className={`${styles.cardArrow} ${styles.cardArrowMusic}`}>준비 중</span>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npx vitest run src/pages/Home.test.tsx
```

Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add src/pages/Home.tsx src/pages/Home.module.css src/pages/Home.test.tsx
git commit -m "feat: implement Home hub page"
```

---

### Task 6: Dev 페이지

**Files:**
- Create: `src/data/projects.ts`
- Modify: `src/pages/Dev.tsx`
- Create: `src/pages/Dev.module.css`
- Create: `src/pages/Dev.test.tsx`

- [ ] **Step 1: 프로젝트 데이터 파일 생성**

`src/data/projects.ts`:
```typescript
export interface Project {
  name: string
  description: string
  githubUrl: string
  tags: string[]
}

export const skills = [
  'TypeScript', 'React', 'Vite', 'Git',
  // 사용하는 기술을 추가하세요
]

export const projects: Project[] = [
  {
    name: 'qwru-parallax',
    description: '개인 브랜드 웹사이트',
    githubUrl: 'https://github.com/qwru0905/qwru-parallax',
    tags: ['React', 'TypeScript'],
  },
  // 프로젝트를 여기에 추가하세요
]
```

- [ ] **Step 2: 실패하는 테스트 작성**

`src/pages/Dev.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import Dev from './Dev'

describe('Dev', () => {
  it('renders GitHub profile link', () => {
    render(<Dev />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/qwru0905'
    )
  })

  it('renders project from projects data', () => {
    render(<Dev />)
    expect(screen.getByText('qwru-parallax')).toBeInTheDocument()
  })

  it('renders skills section', () => {
    render(<Dev />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/pages/Dev.test.tsx
```

Expected: FAIL

- [ ] **Step 4: Dev 스타일 작성**

`src/pages/Dev.module.css`:
```css
.page {
  padding-top: calc(var(--navbar-height) + 48px);
}

.label {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--accent-dev);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.name {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 900;
  letter-spacing: -1px;
  color: var(--text-primary);
}

.bio {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 12px;
  line-height: 1.7;
  max-width: 520px;
}

.githubLink {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  background: var(--accent-dev-bg);
  border: 1px solid var(--accent-dev-border);
  border-radius: 20px;
  font-size: 12px;
  color: var(--accent-dev);
  transition: background 0.2s;
}

.githubLink:hover {
  background: rgba(130, 80, 255, 0.2);
}

.section {
  margin-top: 40px;
}

.sectionTitle {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill {
  padding: 4px 12px;
  background: var(--accent-dev-bg);
  border: 1px solid var(--accent-dev-border);
  border-radius: 20px;
  font-size: 12px;
  color: var(--accent-dev);
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.projectCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.projectCard:hover {
  border-color: var(--accent-dev-border);
}

.projectName {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.projectDesc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}

.projectTags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.tag {
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.projectLink {
  font-size: 11px;
  color: var(--accent-dev);
  opacity: 0.7;
  white-space: nowrap;
  margin-left: 16px;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Dev 컴포넌트 작성**

`src/pages/Dev.tsx`:
```tsx
import PageLayout from '../components/PageLayout'
import { projects, skills } from '../data/projects'
import styles from './Dev.module.css'

export default function Dev() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <p className={styles.label}>Developer</p>
        <h1 className={styles.name}>qwru0905</h1>
        <p className={styles.bio}>
          {/* 자기소개를 여기에 입력하세요 */}
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
          <div className={styles.projects}>
            {projects.map((project) => (
              <div key={project.name} className={styles.projectCard}>
                <div>
                  <p className={styles.projectName}>{project.name}</p>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <div className={styles.projectTags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectLink}
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

- [ ] **Step 6: 테스트 통과 확인**

```bash
npx vitest run src/pages/Dev.test.tsx
```

Expected: PASS

- [ ] **Step 7: 커밋**

```bash
git add src/data/projects.ts src/pages/Dev.tsx src/pages/Dev.module.css src/pages/Dev.test.tsx
git commit -m "feat: implement Developer page"
```

---

### Task 7: YouTube 페이지

**Files:**
- Create: `src/data/videos.ts`
- Modify: `src/pages/YouTube.tsx`
- Create: `src/pages/YouTube.module.css`
- Create: `src/pages/YouTube.test.tsx`

- [ ] **Step 1: 영상 데이터 파일 생성**

`src/data/videos.ts`:
```typescript
export interface Video {
  id: string    // YouTube 영상 ID (URL의 ?v= 값)
  title: string
}

// ⚠️ 실제 채널 URL로 교체 (예: https://www.youtube.com/@your-channel)
export const channelUrl = 'https://www.youtube.com/@YOUR_CHANNEL_NAME'
export const channelName = '채널 이름을 입력하세요'

// 썸네일 URL 형식: https://img.youtube.com/vi/{id}/hqdefault.jpg
// ⚠️ 실제 영상 ID로 교체하세요
export const videos: Video[] = [
  { id: 'REPLACE_WITH_VIDEO_ID', title: '영상 제목 1' },
  { id: 'REPLACE_WITH_VIDEO_ID', title: '영상 제목 2' },
  { id: 'REPLACE_WITH_VIDEO_ID', title: '영상 제목 3' },
]
```

- [ ] **Step 2: 실패하는 테스트 작성**

`src/pages/YouTube.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import YouTube from './YouTube'

describe('YouTube', () => {
  it('renders subscribe button linking to YouTube', () => {
    render(<YouTube />)
    const link = screen.getByRole('link', { name: /구독하기/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', expect.stringContaining('youtube.com'))
  })

  it('renders video thumbnails', () => {
    render(<YouTube />)
    const thumbnails = screen.getAllByRole('img')
    expect(thumbnails.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/pages/YouTube.test.tsx
```

Expected: FAIL

- [ ] **Step 4: YouTube 스타일 작성**

`src/pages/YouTube.module.css`:
```css
.page {
  padding-top: calc(var(--navbar-height) + 48px);
}

.label {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--accent-youtube);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.channelRow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
}

.channelIcon {
  width: 44px;
  height: 44px;
  background: var(--accent-youtube-bg);
  border: 2px solid var(--accent-youtube-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.channelName {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.channelDesc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.subscribeBtn {
  margin-left: auto;
  padding: 8px 20px;
  background: var(--accent-youtube);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.subscribeBtn:hover {
  opacity: 0.85;
}

.sectionTitle {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin: 32px 0 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.videoCard {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: border-color 0.2s, transform 0.2s;
}

.videoCard:hover {
  border-color: var(--accent-youtube-border);
  transform: translateY(-2px);
}

.thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  background: rgba(255, 255, 255, 0.05);
}

.videoTitle {
  padding: 8px 10px;
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.moreLink {
  display: block;
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--accent-youtube);
  opacity: 0.7;
  transition: opacity 0.2s;
}

.moreLink:hover { opacity: 1; }

@media (max-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .subscribeBtn { display: none; }
}
```

- [ ] **Step 5: YouTube 컴포넌트 작성**

`src/pages/YouTube.tsx`:
```tsx
import PageLayout from '../components/PageLayout'
import { channelUrl, channelName, videos } from '../data/videos'
import styles from './YouTube.module.css'

export default function YouTube() {
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
        <div className={styles.grid}>
          {videos.map((video) => (
            <a
              key={video.id + video.title}
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

- [ ] **Step 6: 테스트 통과 확인**

```bash
npx vitest run src/pages/YouTube.test.tsx
```

Expected: PASS

- [ ] **Step 7: 커밋**

```bash
git add src/data/videos.ts src/pages/YouTube.tsx src/pages/YouTube.module.css src/pages/YouTube.test.tsx
git commit -m "feat: implement YouTube page"
```

---

### Task 8: Music 페이지

**Files:**
- Modify: `src/pages/Music.tsx`
- Create: `src/pages/Music.module.css`
- Create: `src/pages/Music.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/pages/Music.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import Music from './Music'

describe('Music', () => {
  it('renders coming soon label', () => {
    render(<Music />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders preparation message', () => {
    render(<Music />)
    expect(screen.getByText(/준비/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/pages/Music.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Music 스타일 작성**

`src/pages/Music.module.css`:
```css
.page {
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--navbar-height);
}

.inner {
  text-align: center;
}

.icon {
  font-size: 48px;
  opacity: 0.4;
  margin-bottom: 20px;
}

.label {
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--accent-music);
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: 12px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.desc {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 280px;
  margin: 0 auto;
  line-height: 1.7;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-music);
  animation: pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(2) { animation-delay: 0.3s; opacity: 0.6; }
.dot:nth-child(3) { animation-delay: 0.6s; opacity: 0.3; }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
}
```

- [ ] **Step 4: Music 컴포넌트 작성**

`src/pages/Music.tsx`:
```tsx
import PageLayout from '../components/PageLayout'
import styles from './Music.module.css'

export default function Music() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.icon}>🎵</p>
          <p className={styles.label}>Coming Soon</p>
          <h1 className={styles.title}>음악을 준비하고 있어요</h1>
          <p className={styles.desc}>
            곧 이 공간에 작곡한 음악들이 채워질 거예요. 기대해주세요.
          </p>
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npx vitest run src/pages/Music.test.tsx
```

Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add src/pages/Music.tsx src/pages/Music.module.css src/pages/Music.test.tsx
git commit -m "feat: implement Music coming soon page"
```

---

### Task 9: 최종 확인 + GitHub 푸시

- [ ] **Step 1: 전체 테스트 실행**

```bash
npx vitest run
```

Expected: 모든 테스트 PASS (PageLayout, Navbar, Home, Dev, YouTube, Music)

- [ ] **Step 2: TypeScript 타입 체크**

```bash
npx tsc -b
```

Expected: 오류 없음

- [ ] **Step 3: 프로덕션 빌드**

```bash
npm run build
```

Expected: `dist/` 생성, 빌드 성공

- [ ] **Step 4: 개발 서버 수동 확인**

```bash
npm run dev
```

브라우저에서 아래 URL 순서로 확인:

| URL | 확인 사항 |
|-----|----------|
| `http://localhost:5173/` | qwru0905 타이틀, 3개 포털 카드 |
| `http://localhost:5173/dev` | 소개, GitHub 링크, 기술스택, 프로젝트 |
| `http://localhost:5173/youtube` | 채널 정보, 구독 버튼, 영상 그리드 |
| `http://localhost:5173/music` | Coming Soon 텍스트, 펄스 애니메이션 |

- [ ] **Step 5: GitHub 푸시**

```bash
git push -u origin master
```

---

## 구현 후 실제 데이터로 교체

| 파일 | 교체할 내용 |
|------|------------|
| `src/data/videos.ts` | `channelUrl`, `channelName`, 실제 YouTube 영상 ID |
| `src/data/projects.ts` | 실제 프로젝트 목록, 기술 스택 |
| `src/pages/Dev.tsx` | 자기소개 텍스트 (bio 부분) |
