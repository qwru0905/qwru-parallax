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
