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
    setLoading(true)
    setError(null)
    setRepos([])
    const controller = new AbortController()
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.json()
      })
      .then((data: GitHubRepo[]) => {
        setRepos(data.filter((r) => !r.fork))
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError('레포지토리를 불러오지 못했습니다.')
        setLoading(false)
      })
    return () => controller.abort()
  }, [username])

  return { repos, loading, error }
}
