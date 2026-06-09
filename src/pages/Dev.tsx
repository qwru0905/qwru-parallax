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
                  aria-label={`${project.name} repository`}
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
