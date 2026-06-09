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
