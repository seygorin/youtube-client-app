import { VideoState } from '../models/state.model';

export const CUSTOM_VIDEOS_KEY = 'custom_videos';

export const initialVideoState: VideoState = {
  videos: [
    {
      id: 'YN8zNnV0sK8',
      title: 'Introduction to Angular - Learning Angular',
      description:
        'In this series, learn how to build your first Angular application. Angular is a web framework that allows teams to deliver web apps with confidence. Discover how these tools build scalable applications.',
      publishedAt: '2025-03-15T12:42:19.000Z',
      thumbnail: 'https://i.ytimg.com/vi/xAT0lHYhHMY/maxresdefault.jpg',
      viewCount: 33265,
      likeCount: 1173,
      dislikeCount: 26,
      commentCount: 170,
      channelTitle: 'Angular',
    },
    {
      id: 'wPT3K3w6JtU',
      title: 'Angular Material Components - Complete Guide',
      description:
        'Explore the Material Design components available in Angular Material. Learn how to create beautiful, responsive interfaces with Angular Material components.',
      thumbnail: 'https://i.ytimg.com/vi/wPT3K3w6JtU/maxresdefault.jpg',
      publishedAt: '2023-05-20T10:30:00Z',
      viewCount: 85000,
      likeCount: 3200,
      dislikeCount: 150,
      commentCount: 450,
      channelTitle: 'Angular University',
    },
    {
      id: 'REu2BcnlD34',
      title: 'Angular Signals - The Future of State Management',
      description:
        'Learn about Angular Signals, the new primitive for managing state in Angular applications. Discover how Signals offer an elegant alternative to RxJS for reactive programming.',
      thumbnail: 'https://i.ytimg.com/vi/REu2BcnlD34/maxresdefault.jpg',
      publishedAt: '2024-12-01T14:25:00Z',
      viewCount: 45000,
      likeCount: 2100,
      dislikeCount: 30,
      commentCount: 210,
      channelTitle: 'Angular',
    },
    {
      id: 'qbPTdW7KgOg',
      title: 'Standalone Components in Angular - Modern Angular Development',
      description:
        'Discover how Standalone Components simplify Angular development by reducing the need for NgModules. Learn the benefits and implementation details of this new paradigm.',
      thumbnail: 'https://i.ytimg.com/vi/qbPTdW7KgOg/maxresdefault.jpg',
      publishedAt: '2025-04-04T11:10:00Z',
      viewCount: 28500,
      likeCount: 1560,
      dislikeCount: 12,
      commentCount: 95,
      channelTitle: 'Google Developers',
    },
  ],
  customVideos: [],
  selectedVideo: null,
  searchResults: [],
  searchQuery: '',
  sorting: {
    field: 'date',
    direction: 'desc',
  },
  filterKeyword: '',
  showFilters: false,
  loading: false,
  error: null,
};
