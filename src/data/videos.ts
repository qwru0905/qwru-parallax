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
