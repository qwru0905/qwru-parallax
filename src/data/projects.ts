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
    tags: ['React', 'Vite'],
  },
  // 프로젝트를 여기에 추가하세요
]
