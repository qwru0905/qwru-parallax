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
