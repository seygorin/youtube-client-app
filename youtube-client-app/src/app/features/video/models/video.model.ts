export interface VideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  channelTitle: string;
  isCustom?: boolean;
}
