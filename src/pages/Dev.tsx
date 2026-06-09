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
