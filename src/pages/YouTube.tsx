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
